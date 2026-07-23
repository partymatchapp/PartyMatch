"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";

import {
  checkExistingMatch
} from "@/lib/matches";



export default function PerfilPage(){


  const params = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();


  const id = params.id as string;

  const eventoId = searchParams.get("evento");


  const { user } = useUser();


  const [perfil,setPerfil] = useState<any>(null);

  const [matchId,setMatchId] = useState<string | null>(null);

  const [cargando,setCargando] = useState(true);





  useEffect(()=>{


    async function cargar(){


      if(!id){
        return;
      }



      const snap = await getDoc(
        doc(
          db,
          "usuarios",
          id
        )
      );



      if(snap.exists()){


        setPerfil({

          id:snap.id,

          ...snap.data()

        });


      }





      if(
        user &&
        eventoId &&
        user.uid !== id
      ){


        const match = await checkExistingMatch(

          eventoId,

          user.uid,

          id

        );


        setMatchId(match);


      }





      setCargando(false);


    }



    cargar();



  },[id,user,eventoId]);







  if(cargando){


    return(

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        Cargando perfil...

      </div>

    );


  }







  if(!perfil){


    return(

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        Perfil no encontrado

      </div>

    );


  }







  return(


    <main className="
      min-h-screen
      bg-black
      text-white
      p-6
    ">



      <div className="
        max-w-md
        mx-auto
        bg-slate-900
        rounded-3xl
        p-8
        text-center
        shadow-2xl
      ">



        {
          perfil.foto ? (

            <img

              src={perfil.foto}

              alt="perfil"

              className="
                w-40
                h-40
                rounded-full
                object-cover
                mx-auto
                mb-6
                border-4
                border-purple-500
              "

            />

          ) : (

            <div className="
              w-40
              h-40
              rounded-full
              bg-slate-700
              flex
              items-center
              justify-center
              text-7xl
              mx-auto
              mb-6
            ">

              👤

            </div>

          )
        }







        <h1 className="
          text-3xl
          font-bold
        ">

          {perfil.nombre || "Usuario"}

        </h1>





        {
          perfil.edad && (

            <p className="
              text-gray-400
              mt-2
              text-lg
            ">

              {perfil.edad} años

            </p>

          )
        }








        {
          perfil.genero && (

            <p className="
              text-purple-400
              mt-3
            ">

              {perfil.genero}

            </p>

          )
        }









        {
          matchId ? (

            <div className="mt-8">


              <p className="
                text-green-400
                font-bold
                text-xl
                mb-5
              ">

                🎉 ¡Tienen Match!

              </p>




              <button

                onClick={()=>router.push(`/chat/${matchId}`)}

                className="
                  bg-blue-600
                  hover:bg-blue-700
                  px-8
                  py-3
                  rounded-xl
                  font-bold
                  w-full
                "

              >

                💬 Abrir Chat

              </button>


            </div>


          ) : (


            <p className="
              mt-8
              text-gray-400
            ">

              ❤️ Esperando conexión

            </p>


          )

        }







        <button

          onClick={()=>router.back()}

          className="
            mt-8
            bg-slate-700
            hover:bg-slate-600
            px-6
            py-3
            rounded-xl
            font-bold
            w-full
          "

        >

          Volver

        </button>






      </div>


    </main>


  );


}