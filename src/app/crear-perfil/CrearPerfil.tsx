"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { loginAnonymous } from "@/lib/auth";
import { updateUserProfile } from "@/lib/users";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import { storage } from "@/lib/firebase";


export default function CrearPerfilPage() {


  const router = useRouter();

  const searchParams = useSearchParams();

  const eventoId = searchParams.get("evento");



  const [nombre,setNombre] = useState("");

  const [edad,setEdad] = useState("");

  const [genero,setGenero] = useState("");

  const [busca,setBusca] = useState("");

  const [foto,setFoto] = useState<File | null>(null);

  const [preview,setPreview] = useState("");

  const [guardando,setGuardando] = useState(false);





  function seleccionarFoto(
    e: React.ChangeEvent<HTMLInputElement>
  ){


    const archivo = e.target.files?.[0];


    if(!archivo) return;


    setFoto(archivo);


    setPreview(
      URL.createObjectURL(archivo)
    );


  }








  async function crearPerfil(){



    if(
      !nombre ||
      !edad ||
      !genero ||
      !busca
    ){

      alert(
        "Completá todos los datos"
      );

      return;

    }




    if(!foto){

      alert(
        "La foto de perfil es obligatoria"
      );

      return;

    }



    setGuardando(true);



    try{


      console.log(
        "⏳ Creando usuario..."
      );



      const user = await loginAnonymous();



      if(!user){

        throw new Error(
          "No se pudo crear usuario"
        );

      }



      console.log(
        "✅ Usuario:",
        user.uid
      );





      console.log(
        "⏳ Subiendo foto..."
      );



      const imagenRef = ref(

        storage,

        `usuarios/${user.uid}/perfil.jpg`

      );



      await uploadBytes(

        imagenRef,

        foto

      );



      const urlFoto = await getDownloadURL(

        imagenRef

      );



      console.log(
        "✅ Foto subida:",
        urlFoto
      );







      await updateUserProfile(

        user.uid,

        {

          nombre,

          edad,

          foto:urlFoto,

          genero,

          busca,

          intereses:[]

        }

      );





      console.log(
        "✅ Perfil creado"
      );






      if(eventoId){


        router.push(

          `/evento/${eventoId}`

        );


      }else{


        router.push(

          `/perfil/${user.uid}`

        );


      }




    }catch(error:any){



      console.error(
        "❌ Error creando perfil:",
        error
      );



      alert(

        error.message ||

        "Error creando perfil"

      );



    }finally{


      setGuardando(false);


    }


  }








  return (

    <main className="
      min-h-screen
      bg-slate-900
      flex
      items-center
      justify-center
      p-6
    ">


      <div className="
        bg-white
        rounded-3xl
        shadow-xl
        p-8
        w-full
        max-w-md
      ">


        <h1 className="
          text-3xl
          font-bold
          text-black
          text-center
        ">

          Crear perfil 🎉

        </h1>



        {
          preview && (

            <img

              src={preview}

              className="
                w-32
                h-32
                rounded-full
                object-cover
                mx-auto
                mt-6
              "

            />

          )
        }





        <label className="
          block
          mt-6
          text-center
          bg-black
          text-white
          py-3
          rounded-xl
          cursor-pointer
        ">

          📷 Elegir foto obligatoria


          <input

            type="file"

            accept="image/*"

            onChange={seleccionarFoto}

            className="hidden"

          />


        </label>





        <input

          value={nombre}

          onChange={(e)=>setNombre(e.target.value)}

          placeholder="Tu nombre"

          className="
            w-full
            mt-6
            border
            rounded-xl
            p-3
            text-black
          "

        />





        <input

          value={edad}

          onChange={(e)=>setEdad(e.target.value)}

          placeholder="Edad"

          type="number"

          className="
            w-full
            mt-4
            border
            rounded-xl
            p-3
            text-black
          "

        />





        <select

          value={genero}

          onChange={(e)=>setGenero(e.target.value)}

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






        <select

          value={busca}

          onChange={(e)=>setBusca(e.target.value)}

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







        <button

          onClick={crearPerfil}

          disabled={guardando}

          className="
            w-full
            mt-6
            bg-purple-600
            hover:bg-purple-700
            text-white
            py-3
            rounded-xl
            font-bold
          "

        >

          {
            guardando
            ?
            "Creando..."
            :
            "Entrar a la fiesta 🎉"
          }


        </button>


      </div>


    </main>

  );


}