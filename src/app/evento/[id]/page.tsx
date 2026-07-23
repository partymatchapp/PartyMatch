"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";

import { getEvent } from "@/lib/events";
import { joinEvent, getUserProfile } from "@/lib/users";

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

  const router = useRouter();

  const id = params.id as string;


  const { user } = useUser();



  const [evento,setEvento] = useState<any>(null);

  const [cargando,setCargando] = useState(true);

  const [error,setError] = useState("");

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


    try{

      const cantidad =
        await getUnreadNotificationsCount(
          user.uid
        );


      setContador(cantidad);


    }catch(error){

      console.error(
        "Error contador:",
        error
      );

    }


  }







  useEffect(()=>{


    async function iniciar(){


      try{


        if(!id){

          throw new Error(
            "No existe ID del evento"
          );

        }



        const datos = await getEvent(id);



        if(!datos){

          throw new Error(
            "Evento no encontrado"
          );

        }



        setEvento(datos);




        if(user){



          const perfil =
            await getUserProfile(
              user.uid
            );



          if(
            !perfil ||
            !perfil.perfilCompleto
          ){


            router.push(
              `/crear-perfil?evento=${id}`
            );


            return;

          }




          await joinEvent(
            user.uid,
            id
          );



          await cargarContador();


        }



      }catch(error:any){


        console.error(
          error
        );


        setError(
          error.message
        );


      }finally{


        setCargando(false);


      }


    }



    iniciar();


  },[id,user]);









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







  if(error){


    return(

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
        p-6
      ">

        {error}

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




        <EventLobby eventoId={id}/>




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
              contador > 0 &&
              <span className="
                ml-2
                bg-red-500
                px-2
                py-1
                rounded-full
              ">
                {contador}
              </span>
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
          vista === "discovery" ?

          <Discovery eventoId={id}/> :

          vista === "notificaciones" ?

          <Notifications/> :

          vista === "matches" ?

          <Matches/> :

          <Chats/>

        }



      </div>


    </main>

  );

}