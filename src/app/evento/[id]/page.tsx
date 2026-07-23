"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useUser } from "@/context/UserContext";

import { getEvent } from "@/lib/events";
import { joinEvent } from "@/lib/users";

import {
  getUnreadNotificationsCount
} from "@/lib/notifications";

import EventLobby from "@/components/EventLobby";
import Discovery from "@/components/Discovery";
import Notifications from "@/components/Notifications";
import Matches from "@/components/Matches";
import Chats from "@/components/Chats";



export default function EventoPage(){



  const params = useParams();

  const id = params.id as string;


  const { user } = useUser();




  const [evento,setEvento] = useState<any>(null);

  const [cargando,setCargando] = useState(true);



  const [vista,setVista] = useState<

    "discovery" |
    "notificaciones" |
    "matches" |
    "chats"

  >("discovery");



  const [contador,setContador] = useState(0);









  async function cargarContador(){


    if(!user){

      return;

    }



    const cantidad = await getUnreadNotificationsCount(

      user.uid

    );



    setContador(cantidad);


  }









  useEffect(()=>{


    async function cargarEvento(){



      if(!id){

        return;

      }



      const datos = await getEvent(id);



      setEvento(datos);

      setCargando(false);



    }



    cargarEvento();


  },[id]);











  useEffect(()=>{


    async function unirUsuario(){



      if(user && id){



        await joinEvent(

          user.uid,

          id

        );



        await cargarContador();


      }


    }



    unirUsuario();



  },[user,id]);












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

        Cargando evento...

      </div>

    );


  }









  if(!evento){


    return(

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        Evento no encontrado

      </div>

    );


  }









  return(


    <main className="
      min-h-screen
      bg-black
      p-6
    ">



      <div className="
        max-w-4xl
        mx-auto
      ">



        <h1 className="
          text-3xl
          font-bold
          text-center
          mb-8
          text-white
        ">


          {evento.nombre} 🎉


        </h1>





        <EventLobby

          eventoId={id}

        />









        <div className="
          flex
          justify-center
          gap-3
          mt-8
          mb-8
          flex-wrap
        ">





          <button

            onClick={()=>setVista("discovery")}

            className="
              bg-blue-600
              text-white
              px-5
              py-3
              rounded-xl
              font-bold
            "

          >

            🔍 Descubrir

          </button>









          <button

            onClick={()=>setVista("notificaciones")}

            className="
              bg-black
              border
              border-blue-400
              text-white
              px-5
              py-3
              rounded-xl
              font-bold
            "

          >

            🔔 Notificaciones


            {
              contador > 0 && (

                <span className="
                  ml-2
                  bg-red-500
                  px-2
                  py-1
                  rounded-full
                  text-sm
                ">

                  {contador}

                </span>

              )
            }


          </button>









          <button

            onClick={()=>setVista("matches")}

            className="
              bg-black
              border
              border-pink-400
              text-white
              px-5
              py-3
              rounded-xl
              font-bold
            "

          >

            🎉 Matches

          </button>









          <button

            onClick={()=>setVista("chats")}

            className="
              bg-black
              border
              border-green-400
              text-white
              px-5
              py-3
              rounded-xl
              font-bold
            "

          >

            💬 Chats

          </button>








        </div>









        {
          vista === "discovery" ? (


            <Discovery

              eventoId={id}

            />


          ) : vista === "notificaciones" ? (



            <Notifications />



          ) : vista === "matches" ? (



            <Matches />



          ) : (



            <Chats />



          )

        }








      </div>


    </main>


  );


}