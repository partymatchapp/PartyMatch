"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { loginAnonymous } from "@/lib/auth";

import {
  updateUserProfile,
  joinEvent
} from "@/lib/users";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import { storage } from "@/lib/firebase";



export default function CrearPerfil(){


  const router = useRouter();

  const searchParams = useSearchParams();

  const eventoId = searchParams.get("evento");



  const [nombre,setNombre] = useState("");

  const [edad,setEdad] = useState("");

  const [genero,setGenero] = useState("");

  const [busca,setBusca] = useState("");



  const [foto,setFoto] =
    useState<File|null>(null);


  const [fotosExtra,setFotosExtra] =
    useState<File[]>([]);



  const [preview,setPreview] =
    useState("");



  const [previewExtras,setPreviewExtras] =
    useState<string[]>([]);



  const [guardando,setGuardando] =
    useState(false);







  function seleccionarFoto(
    e:React.ChangeEvent<HTMLInputElement>
  ){


    const archivo =
      e.target.files?.[0];


    if(!archivo) return;


    setFoto(archivo);


    setPreview(
      URL.createObjectURL(archivo)
    );


  }








  function seleccionarFotosExtra(
    e:React.ChangeEvent<HTMLInputElement>
  ){


    const archivos =
      Array.from(
        e.target.files || []
      );


    const nuevas =
      archivos.slice(
        0,
        3
      );


    setFotosExtra(nuevas);



    setPreviewExtras(

      nuevas.map((foto)=>
        URL.createObjectURL(foto)
      )

    );


  }









  async function subirImagen(

    archivo:File,

    nombre:string,

    uid:string

  ){


    const imagenRef = ref(

      storage,

      `usuarios/${uid}/${nombre}`

    );



    await uploadBytes(

      imagenRef,

      archivo

    );



    return await getDownloadURL(

      imagenRef

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



      const user =
        await loginAnonymous();




      if(!user){

        throw new Error(
          "No se pudo crear usuario"
        );

      }







      const urlPrincipal =
        await subirImagen(

          foto,

          "perfil.jpg",

          user.uid

        );







      const urlsExtras:string[] = [];




      for(
        let i = 0;
        i < fotosExtra.length;
        i++
      ){


        const url =
          await subirImagen(

            fotosExtra[i],

            `foto${i+2}.jpg`,

            user.uid

          );


        urlsExtras.push(url);


      }









      await updateUserProfile(

        user.uid,

        {


          nombre,

          edad,

          genero,

          busca,


          foto:urlPrincipal,


          fotos:urlsExtras,


          intereses:[]


        }

      );








      if(!eventoId){

        throw new Error(
          "No llegó el ID del evento"
        );

      }






      await joinEvent(

        user.uid,

        eventoId

      );






      router.push(

        `/evento/${eventoId}`

      );





    }catch(error:any){



      console.error(
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

          📷 Foto principal


          <input

            type="file"

            accept="image/*"

            onChange={seleccionarFoto}

            className="hidden"

          />


        </label>








        <label className="
          block
          mt-4
          text-center
          bg-purple-600
          text-white
          py-3
          rounded-xl
          cursor-pointer
        ">


          📸 Agregar hasta 3 fotos más


          <input

            type="file"

            accept="image/*"

            multiple

            onChange={seleccionarFotosExtra}

            className="hidden"

          />


        </label>






        {
          previewExtras.length > 0 && (

            <div className="
              flex
              gap-2
              mt-4
              justify-center
            ">


              {
                previewExtras.map((foto,i)=>(

                  <img

                    key={i}

                    src={foto}

                    className="
                      w-20
                      h-20
                      rounded-xl
                      object-cover
                    "

                  />

                ))

              }


            </div>

          )

        }








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