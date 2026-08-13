"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useRouter,
  useSearchParams
} from "next/navigation";

import {
  onAuthStateChanged,
  User
} from "firebase/auth";

import {
  updateUserProfile,
  joinEvent,
  getUserProfile
} from "@/lib/users";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import {
  auth,
  storage
} from "@/lib/firebase";



export default function CrearPerfil() {


  const router =
    useRouter();


  const searchParams =
    useSearchParams();


  const eventoId =
    searchParams.get("evento");



  // =====================================================
  // USUARIO AUTENTICADO
  // =====================================================

  const [
    user,
    setUser
  ] = useState<User | null>(null);


  const [
    cargandoUsuario,
    setCargandoUsuario
  ] = useState(true);



  // =====================================================
  // DATOS DEL PERFIL
  // =====================================================

  const [
    nombre,
    setNombre
  ] = useState("");


  const [
    edad,
    setEdad
  ] = useState("");


  const [
    genero,
    setGenero
  ] = useState("");


  const [
    busca,
    setBusca
  ] = useState("");


  const [
    fotoExistente,
    setFotoExistente
  ] = useState("");


  const [
    fotosExistentes,
    setFotosExistentes
  ] = useState<string[]>([]);



  // =====================================================
  // NUEVAS FOTOS
  // =====================================================

  const [
    foto,
    setFoto
  ] = useState<File | null>(null);


  const [
    fotosExtra,
    setFotosExtra
  ] = useState<File[]>([]);


  const [
    preview,
    setPreview
  ] = useState("");


  const [
    previewExtras,
    setPreviewExtras
  ] = useState<string[]>([]);



  // =====================================================
  // ESTADOS
  // =====================================================

  const [
    guardando,
    setGuardando
  ] = useState(false);


  const [
    cargandoPerfil,
    setCargandoPerfil
  ] = useState(true);



  // =====================================================
  // ESCUCHAR AUTHENTICATION
  // =====================================================

  useEffect(() => {


    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (usuario) => {


          if (!usuario) {

            console.log(
              "⚠️ No hay usuario autenticado"
            );


            setUser(null);

            setCargandoUsuario(false);

            setCargandoPerfil(false);

            return;

          }



          console.log(
            "✅ Usuario autenticado:",
            usuario.uid
          );


          console.log(
            "📧 Email:",
            usuario.email
          );


          setUser(usuario);

          setCargandoUsuario(false);



          // =================================================
          // BUSCAR PERFIL EXISTENTE
          // =================================================

          try {


            const perfil =
              await getUserProfile(
                usuario.uid
              );



            if (perfil) {


              console.log(
                "✅ Perfil encontrado en Firestore"
              );



              // ---------------------------------------------
              // CARGAR DATOS EXISTENTES
              // ---------------------------------------------

              setNombre(
                perfil.nombre || ""
              );


              setEdad(
                perfil.edad || ""
              );


              setGenero(
                perfil.genero || ""
              );


              setBusca(
                perfil.busca || ""
              );


              setFotoExistente(
                perfil.foto || ""
              );


              setFotosExistentes(
                perfil.fotos || []
              );



              // ---------------------------------------------
              // PREVIEW DE FOTO EXISTENTE
              // ---------------------------------------------

              if (perfil.foto) {

                setPreview(
                  perfil.foto
                );

              }



              // ---------------------------------------------
              // PREVIEW DE FOTOS EXTRA
              // ---------------------------------------------

              if (
                perfil.fotos &&
                perfil.fotos.length > 0
              ) {

                setPreviewExtras(
                  perfil.fotos
                );

              }



              console.log(
                "👤 Nombre:",
                perfil.nombre
              );


              console.log(
                "📷 Foto:",
                perfil.foto
                  ? "Sí"
                  : "No"
              );


              console.log(
                "📋 Perfil completo:",
                perfil.perfilCompleto
              );

            }
            else {

              console.log(
                "ℹ️ No existe perfil en Firestore"
              );

            }


          } catch (error) {


            console.error(
              "❌ Error cargando perfil:",
              error
            );


          } finally {


            setCargandoPerfil(
              false
            );


          }

        }
      );


    return () =>
      unsubscribe();


  }, []);





  // =====================================================
  // SELECCIONAR FOTO PRINCIPAL
  // =====================================================

  function seleccionarFoto(

    e: React.ChangeEvent<HTMLInputElement>

  ) {


    const archivo =
      e.target.files?.[0];


    if (!archivo) {

      return;

    }


    setFoto(
      archivo
    );


    setPreview(
      URL.createObjectURL(
        archivo
      )
    );

  }





  // =====================================================
  // SELECCIONAR FOTOS EXTRA
  // =====================================================

  function seleccionarFotosExtra(

    e: React.ChangeEvent<HTMLInputElement>

  ) {


    const archivos =
      Array.from(
        e.target.files || []
      );


    const nuevas =
      archivos.slice(
        0,
        3
      );


    setFotosExtra(
      nuevas
    );


    setPreviewExtras(

      nuevas.map(
        (archivo) =>
          URL.createObjectURL(
            archivo
          )
      )

    );

  }





  // =====================================================
  // SUBIR IMAGEN
  // =====================================================

  async function subirImagen(

    archivo: File,

    nombreArchivo: string,

    uid: string

  ) {


    const imagenRef =
      ref(

        storage,

        `usuarios/${uid}/${nombreArchivo}`

      );


    await uploadBytes(

      imagenRef,

      archivo

    );


    return await getDownloadURL(

      imagenRef

    );

  }





  // =====================================================
  // CREAR / ACTUALIZAR PERFIL
  // =====================================================

  async function crearPerfil() {


    // ---------------------------------------------------
    // VERIFICAR AUTH
    // ---------------------------------------------------

    if (!user) {


      alert(
        "Tu sesión no está iniciada. Volvé a ingresar."
      );


      router.push(
        eventoId
          ? `/login?evento=${eventoId}`
          : "/login"
      );


      return;

    }



    // ---------------------------------------------------
    // VERIFICAR DATOS
    // ---------------------------------------------------

    if (

      !nombre.trim() ||
      !edad ||
      !genero ||
      !busca

    ) {


      alert(
        "Completá todos los datos"
      );


      return;

    }



    // ---------------------------------------------------
    // FOTO
    //
    // Puede ser una foto nueva o una existente.
    // ---------------------------------------------------

    if (
      !foto &&
      !fotoExistente
    ) {


      alert(
        "La foto de perfil es obligatoria"
      );


      return;

    }



    // ---------------------------------------------------
    // EVENTO
    // ---------------------------------------------------

    if (!eventoId) {


      alert(
        "No se encontró el ID del evento."
      );


      return;

    }



    setGuardando(
      true
    );



    try {


      console.log(
        "🚀 Actualizando perfil:"
      );


      console.log(
        "UID:",
        user.uid
      );


      console.log(
        "Nombre:",
        nombre
      );



      // =================================================
      // FOTO PRINCIPAL
      // =================================================

      let urlPrincipal =
        fotoExistente;



      if (foto) {


        console.log(
          "📷 Subiendo nueva foto principal..."
        );


        urlPrincipal =
          await subirImagen(

            foto,

            "perfil.jpg",

            user.uid

          );


        console.log(
          "✅ Foto principal subida"
        );

      }



      // =================================================
      // FOTOS EXTRA
      // =================================================

      let urlsExtras =
        fotosExistentes;



      if (
        fotosExtra.length > 0
      ) {


        console.log(
          "📸 Subiendo fotos adicionales..."
        );


        urlsExtras = [];


        for (

          let i = 0;

          i < fotosExtra.length;

          i++

        ) {


          const url =
            await subirImagen(

              fotosExtra[i],

              `foto${i + 2}.jpg`,

              user.uid

            );


          urlsExtras.push(
            url
          );

        }


        console.log(
          "✅ Fotos adicionales subidas"
        );

      }



      // =================================================
      // ACTUALIZAR FIRESTORE
      // =================================================

      await updateUserProfile(

        user.uid,

        {

          nombre:
            nombre.trim(),

          edad:
            edad,

          genero:
            genero,

          busca:
            busca,

          foto:
            urlPrincipal,

          fotos:
            urlsExtras,

          intereses:
            []

        }

      );



      console.log(
        "✅ Perfil actualizado correctamente"
      );



      // =================================================
      // UNIR AL EVENTO
      // =================================================

      await joinEvent(

        user.uid,

        eventoId

      );



      console.log(
        "🎉 Usuario unido al evento"
      );



      // =================================================
      // ENTRAR AL EVENTO
      // =================================================

      router.push(

        `/evento/${eventoId}`

      );


    } catch (error: any) {


      console.error(
        "❌ Error actualizando perfil:",
        error
      );


      alert(

        error.message ||
        "Error actualizando perfil"

      );


    } finally {


      setGuardando(
        false
      );


    }

  }





  // =====================================================
  // CARGANDO
  // =====================================================

  if (
    cargandoUsuario ||
    cargandoPerfil
  ) {


    return (

      <main
        className="
          min-h-screen
          bg-slate-900
          flex
          items-center
          justify-center
          text-white
        "
      >

        <div
          className="
            text-center
          "
        >

          <div
            className="
              text-5xl
              mb-4
            "
          >
            🎉
          </div>


          <p>
            Cargando tu perfil...
          </p>

        </div>

      </main>

    );

  }





  // =====================================================
  // SIN SESIÓN
  // =====================================================

  if (!user) {


    return (

      <main
        className="
          min-h-screen
          bg-slate-900
          flex
          items-center
          justify-center
          p-6
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            p-8
            w-full
            max-w-md
            text-center
          "
        >

          <div
            className="
              text-5xl
              mb-4
            "
          >
            🔐
          </div>


          <h1
            className="
              text-2xl
              font-bold
              text-black
              mb-3
            "
          >
            Necesitás iniciar sesión
          </h1>


          <p
            className="
              text-gray-600
              mb-6
            "
          >
            Ingresá con tu usuario y contraseña
            para continuar.
          </p>


          <button
            onClick={() =>
              router.push(
                eventoId
                  ? `/login?evento=${eventoId}`
                  : "/login"
              )
            }
            className="
              w-full
              bg-purple-600
              hover:bg-purple-700
              text-white
              py-3
              rounded-xl
              font-bold
            "
          >
            🔐 Ir a iniciar sesión
          </button>

        </div>

      </main>

    );

  }





  // =====================================================
  // FORMULARIO
  // =====================================================

  return (

    <main
      className="
        min-h-screen
        bg-slate-900
        flex
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          shadow-xl
          p-8
          w-full
          max-w-md
        "
      >


        <h1
          className="
            text-3xl
            font-bold
            text-black
            text-center
          "
        >
          {fotoExistente
            ? "Tu perfil 🎉"
            : "Crear perfil 🎉"
          }
        </h1>


        <p
          className="
            text-gray-500
            text-center
            mt-2
          "
        >
          Completá tus datos para participar.
        </p>



        {/* =================================================
            FOTO PRINCIPAL
        ================================================= */}

        {preview && (

          <img

            src={preview}

            alt="Foto de perfil"

            className="
              w-32
              h-32
              rounded-full
              object-cover
              mx-auto
              mt-6
            "

          />

        )}



        <label
          className="
            block
            mt-6
            text-center
            bg-black
            text-white
            py-3
            rounded-xl
            cursor-pointer
            hover:bg-gray-800
          "
        >

          📷
          {fotoExistente
            ? " Cambiar foto principal"
            : " Foto principal"
          }


          <input

            type="file"

            accept="image/*"

            onChange={
              seleccionarFoto
            }

            className="hidden"

          />

        </label>



        {/* =================================================
            FOTOS EXTRA
        ================================================= */}

        <label
          className="
            block
            mt-4
            text-center
            bg-purple-600
            hover:bg-purple-700
            text-white
            py-3
            rounded-xl
            cursor-pointer
          "
        >

          📸 Agregar hasta 3 fotos más


          <input

            type="file"

            accept="image/*"

            multiple

            onChange={
              seleccionarFotosExtra
            }

            className="hidden"

          />

        </label>



        {previewExtras.length > 0 && (

          <div
            className="
              flex
              gap-2
              mt-4
              justify-center
              flex-wrap
            "
          >

            {previewExtras.map(

              (imagen, i) => (

                <img

                  key={i}

                  src={imagen}

                  alt={`Foto ${i + 2}`}

                  className="
                    w-20
                    h-20
                    rounded-xl
                    object-cover
                  "

                />

              )

            )}

          </div>

        )}



        {/* =================================================
            NOMBRE
        ================================================= */}

        <input

          value={nombre}

          onChange={(e) =>
            setNombre(
              e.target.value
            )
          }

          placeholder="Tu nombre"

          className="
            w-full
            mt-6
            border
            border-gray-300
            rounded-xl
            p-3
            text-black
            bg-white
          "

        />



        {/* =================================================
            EDAD
        ================================================= */}

        <input

          value={edad}

          onChange={(e) =>
            setEdad(
              e.target.value
            )
          }

          placeholder="Edad"

          type="number"

          min="18"

          className="
            w-full
            mt-4
            border
            border-gray-300
            rounded-xl
            p-3
            text-black
            bg-white
          "

        />



        {/* =================================================
            GÉNERO
        ================================================= */}

        <select

          value={genero}

          onChange={(e) =>
            setGenero(
              e.target.value
            )
          }

          className="
            w-full
            mt-4
            border
            rounded-xl
            p-3
            bg-black
            text-white
          "

        >

          <option value="">
            Soy...
          </option>

          <option value="hombre">
            Hombre
          </option>

          <option value="mujer">
            Mujer
          </option>

        </select>



        {/* =================================================
            BUSCA
        ================================================= */}

        <select

          value={busca}

          onChange={(e) =>
            setBusca(
              e.target.value
            )
          }

          className="
            w-full
            mt-4
            border
            rounded-xl
            p-3
            bg-black
            text-white
          "

        >

          <option value="">
            Busco...
          </option>

          <option value="hombre">
            Hombre
          </option>

          <option value="mujer">
            Mujer
          </option>

          <option value="todos">
            Todos
          </option>

        </select>



        {/* =================================================
            BOTÓN
        ================================================= */}

        <button

          onClick={
            crearPerfil
          }

          disabled={
            guardando
          }

          className="
            w-full
            mt-6
            bg-purple-600
            hover:bg-purple-700
            disabled:bg-gray-400
            text-white
            py-3
            rounded-xl
            font-bold
          "

        >

          {guardando
            ? "Guardando..."
            : "Entrar a la fiesta 🎉"
          }

        </button>


      </div>

    </main>

  );

}