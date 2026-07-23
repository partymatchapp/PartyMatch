"use client";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import { db, storage } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";



export default function MiPerfil(){


  const { user } = useUser();


  const [perfil,setPerfil] =
    useState<any>(null);


  const [fotos,setFotos] =
    useState<string[]>([]);


  const [archivos,setArchivos] =
    useState<File[]>([]);


  const [subiendo,setSubiendo] =
    useState(false);





  useEffect(()=>{


    async function cargar(){


      if(!user){

        return;

      }


      const snap =
        await getDoc(

          doc(
            db,
            "usuarios",
            user.uid
          )

        );



      if(snap.exists()){


        const datos:any =
          snap.data();


        setPerfil(datos);


        setFotos(
          datos.fotos || []
        );


      }


    }


    cargar();


  },[user]);







  function seleccionarFotos(
    e:React.ChangeEvent<HTMLInputElement>
  ){


    const nuevas =
      Array.from(
        e.target.files || []
      );



    if(
      fotos.length + nuevas.length > 3
    ){

      alert(
        "Máximo 3 fotos adicionales"
      );

      return;

    }



    setArchivos([
      ...archivos,
      ...nuevas
    ]);


  }








  async function subirFotos(){


    if(
      !user ||
      archivos.length===0
    ){

      return;

    }



    setSubiendo(true);



    try{


      const nuevasFotos:string[] = [];



      for(
        let i=0;
        i<archivos.length;
        i++
      ){


        const imagenRef =
          ref(

            storage,

            `usuarios/${user.uid}/fotos/${Date.now()}_${i}.jpg`

          );



        await uploadBytes(

          imagenRef,

          archivos[i]

        );



        const url =
          await getDownloadURL(
            imagenRef
          );



        nuevasFotos.push(url);


      }




      const actualizadas =
        [
          ...fotos,
          ...nuevasFotos
        ];




      await setDoc(

        doc(
          db,
          "usuarios",
          user.uid
        ),

        {

          fotos:actualizadas

        },

        {

          merge:true

        }

      );




      setFotos(
        actualizadas
      );


      setArchivos([]);



      alert(
        "Fotos agregadas 🎉"
      );



    }catch(error){


      console.error(
        error
      );


      alert(
        "Error subiendo fotos"
      );


    }finally{


      setSubiendo(false);


    }


  }







  if(!perfil){


    return(

      <div className="
        text-white
        text-center
        p-6
      ">

        Cargando perfil...

      </div>

    );

  }







  return(


    <div className="
      bg-slate-900
      rounded-3xl
      p-6
      text-center
    ">




      <h2 className="
        text-2xl
        font-bold
        mb-6
      ">

        Mi perfil 👤

      </h2>






      {
        perfil.foto && (

          <div>

            <p className="
              text-gray-400
              mb-2
            ">

              Foto principal

            </p>


            <img

              src={perfil.foto}

              className="
                w-40
                h-40
                rounded-full
                object-cover
                mx-auto
                border-4
                border-purple-500
              "

            />

          </div>

        )
      }







      <h3 className="
        text-xl
        font-bold
        mt-4
      ">

        {perfil.nombre}

      </h3>








      <p className="
        mt-6
        text-gray-400
      ">

        Fotos adicionales

      </p>





      <div className="
        grid
        grid-cols-3
        gap-3
        mt-3
      ">


        {
          fotos.map(
            (foto:string)=>(

              <img

                key={foto}

                src={foto}

                className="
                  w-full
                  h-24
                  rounded-xl
                  object-cover
                "

              />

            )
          )

        }


      </div>








      {
        fotos.length < 3 && (

          <label className="
            block
            mt-6
            bg-white
            text-black
            rounded-xl
            py-3
            cursor-pointer
            font-bold
          ">


            📷 Agregar fotos


            <input

              type="file"

              accept="image/*"

              multiple

              onChange={seleccionarFotos}

              className="hidden"

            />


          </label>

        )
      }







      {
        archivos.length > 0 && (


          <div className="mt-4">


            <p className="
              text-sm
              text-gray-300
            ">

              {archivos.length} foto(s) seleccionada(s)

            </p>



            <button

              onClick={subirFotos}

              disabled={subiendo}

              className="
                mt-3
                bg-purple-600
                rounded-xl
                px-6
                py-3
                font-bold
                w-full
              "

            >

              {
                subiendo
                ?
                "Subiendo..."
                :
                "Guardar fotos 🎉"
              }

            </button>


          </div>


        )

      }







    </div>


  );


}