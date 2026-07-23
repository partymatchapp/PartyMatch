"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  listenMessages,
  sendMessage,
  markMessagesAsRead
} from "@/lib/chat";

import { useUser } from "@/context/UserContext";



type Mensaje = {

  id:string;

  texto:string;

  enviadoPor:string;

  creadoEn:any;

  leido:boolean;

};





export default function ChatPage(){


  const params = useParams();

  const chatId = params.id as string;


  const { user } = useUser();


  const [mensajes,setMensajes] = useState<Mensaje[]>([]);

  const [texto,setTexto] = useState("");

  const [perfil,setPerfil] = useState<any>(null);



  const finalMensajes = useRef<HTMLDivElement | null>(null);







  function bajarAlFinal(){


    finalMensajes.current?.scrollIntoView({

      behavior:"smooth"

    });


  }







  useEffect(()=>{


    const cancelar = listenMessages(

      chatId,

      (lista)=>{

        setMensajes(lista as Mensaje[]);


      }

    );


    return ()=>{

      cancelar();

    };


  },[chatId]);









  useEffect(()=>{


    if(!user || !chatId){

      return;

    }



    markMessagesAsRead(

      chatId,

      user.uid

    );



  },[chatId,user,mensajes]);









  useEffect(()=>{


    bajarAlFinal();


  },[mensajes]);









  useEffect(()=>{


    async function cargarPerfil(){


      if(!user){

        return;

      }



      const snap = await getDoc(

        doc(

          db,

          "matches",

          chatId

        )

      );



      if(!snap.exists()){

        return;

      }




      const datos = snap.data();


      const otroUsuario = datos.usuarios.find(

        (id:string)=>id !== user.uid

      );



      if(!otroUsuario){

        return;

      }




      const usuarioSnap = await getDoc(

        doc(

          db,

          "usuarios",

          otroUsuario

        )

      );



      if(usuarioSnap.exists()){


        setPerfil(usuarioSnap.data());


      }


    }



    cargarPerfil();



  },[chatId,user]);









  async function enviar(){


    if(!user){

      return;

    }


    if(!texto.trim()){

      return;

    }



    await sendMessage(

      chatId,

      user.uid,

      texto.trim()

    );



    setTexto("");


  }









  return(

    <main className="
      min-h-screen
      bg-black
      text-white
      p-6
    ">


      <div className="
        max-w-xl
        mx-auto
      ">



        <div className="
          bg-slate-900
          rounded-2xl
          p-4
          flex
          items-center
          gap-4
          mb-6
        ">


          {
            perfil?.foto && (

              <img

                src={perfil.foto}

                className="
                  w-14
                  h-14
                  rounded-full
                  object-cover
                "

              />

            )
          }



          <h1 className="
            text-2xl
            font-bold
          ">

            {perfil?.nombre || "Chat"}

          </h1>



        </div>






        <div className="
          space-y-3
          mb-6
          max-h-[500px]
          overflow-y-auto
        ">


          {
            mensajes.map((mensaje)=>(


              <div

                key={mensaje.id}

                className={`
                  max-w-xs
                  p-3
                  rounded-2xl

                  ${
                    mensaje.enviadoPor === user?.uid

                    ? "ml-auto bg-blue-600"

                    : "bg-slate-800"

                  }

                `}

              >

                <p>

                  {mensaje.texto}

                </p>



                {
                  mensaje.creadoEn?.toDate && (

                    <span className="
                      text-xs
                      text-gray-300
                    ">

                      {
                        mensaje.creadoEn
                        .toDate()
                        .toLocaleTimeString(
                          [],
                          {
                            hour:"2-digit",
                            minute:"2-digit"
                          }
                        )
                      }

                    </span>

                  )
                }


              </div>


            ))

          }


          <div ref={finalMensajes}/>


        </div>







        <div className="
          flex
          gap-2
        ">



          <input

            value={texto}

            onChange={(e)=>setTexto(e.target.value)}

            placeholder="Escribí un mensaje..."

            className="
              flex-1
              bg-slate-900
              rounded-xl
              p-3
              border
              border-gray-700
            "

          />




          <button

            onClick={enviar}

            className="
              bg-blue-600
              px-5
              rounded-xl
              font-bold
            "

          >

            Enviar

          </button>




        </div>




      </div>


    </main>

  );


}