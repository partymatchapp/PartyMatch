"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";

import { getEvent } from "@/lib/events";

import {
  joinEvent,
  getUserProfile
} from "@/lib/users";

import {
  getUnreadNotificationsCount
} from "@/lib/notifications";


import Discovery from "@/components/Discovery";
import EventLobby from "@/components/EventLobby";
import Notifications from "@/components/Notifications";
import Matches from "@/components/Matches";
import Chats from "@/components/Chats";
import MiPerfil from "@/components/MiPerfil";





type Vista =
  | "discovery"
  | "participantes"
  | "notificaciones"
  | "matches"
  | "chats"
  | "perfil";








export default function EventoPage(){


  const params = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();


  const id = params.id as string;


  const {
    user,
    loading
  } = useUser();






  const [evento,setEvento] =
    useState<any>(null);


  const [cargando,setCargando] =
    useState(true);


  const [error,setError] =
    useState("");





  const [vista,setVista] =
    useState<Vista>(()=>{


      const vistaUrl =
        searchParams.get("vista");



      if(
        vistaUrl === "chats" ||
        vistaUrl === "matches" ||
        vistaUrl === "notificaciones" ||
        vistaUrl === "participantes" ||
        vistaUrl === "discovery" ||
        vistaUrl === "perfil"
      ){

        return vistaUrl;

      }


      return "discovery";


    });





  const [notificaciones,setNotificaciones] =
    useState(0);



  const [chatsNoLeidos,setChatsNoLeidos] =
    useState(0);








  async function cargarNotificaciones(){


    if(!user){

      return;

    }


    const cantidad =
      await getUnreadNotificationsCount(
        user.uid
      );


    setNotificaciones(cantidad);


  }









  useEffect(()=>{


    async function iniciar(){


      try{


        if(!id){

          throw new Error(
            "Evento inválido"
          );

        }





        const datos =
          await getEvent(id);



        if(!datos){

          throw new Error(
            "Evento no encontrado"
          );

        }



        setEvento(datos);





        if(loading){

          return;

        }




        if(!user){


          router.push(
            `/login?evento=${id}`
          );


          return;

        }






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





        await cargarNotificaciones();





      }catch(error:any){


        console.error(error);


        setError(
          error.message
        );


      }finally{


        setCargando(false);


      }


    }





    iniciar();



  },[
    id,
    user,
    loading
  ]);








  useEffect(()=>{


    if(!user){

      return;

    }





    const chatsQuery = query(


      collection(
        db,
        "chats"
      ),


      where(
        "usuarios",
        "array-contains",
        user.uid
      )


    );








    const cancelar = onSnapshot(


      chatsQuery,


      snapshot=>{


        let total = 0;



        snapshot.forEach(doc=>{


          const data:any =
            doc.data();



          total +=
            data.noLeidos?.[user.uid] || 0;



        });




        setChatsNoLeidos(total);



      }


    );





    return ()=>cancelar();



  },[user]);  if(
    cargando ||
    loading
  ){

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
      ">

        {error}

      </div>

    );

  }







  if(!evento){

    return null;

  }








  return(

    <main className="
      min-h-screen
      bg-black
      text-white
      pb-24
    ">



      <header className="
        p-5
        text-center
      ">


        <h1 className="
          text-3xl
          font-bold
        ">

          {evento.nombre} 🎉

        </h1>


      </header>







      <section className="
        max-w-md
        mx-auto
        px-4
      ">





        {
          vista==="discovery" && (

            <Discovery
              eventoId={id}
            />

          )
        }







        {
          vista==="participantes" && (

            <EventLobby
              eventoId={id}
            />

          )
        }







        {
          vista==="notificaciones" && (

            <Notifications/>

          )
        }







        {
          vista==="matches" && (

            <Matches/>

          )
        }







        {
          vista==="chats" && (

            <Chats
              onUnreadChange={setChatsNoLeidos}
            />

          )
        }







        {
          vista==="perfil" && (

            <MiPerfil/>

          )
        }






      </section>











      <nav className="
        fixed
        bottom-0
        left-0
        right-0
        bg-slate-900
        border-t
        border-gray-700
        p-3
        z-40
      ">



        <div className="
          max-w-md
          mx-auto
          flex
          justify-around
          items-center
        ">





          <button

            onClick={()=>setVista("discovery")}

            className="
              flex
              flex-col
              items-center
              text-sm
            "

          >

            ❤️

            <span>
              Descubrir
            </span>

          </button>







          <button

            onClick={()=>setVista("participantes")}

            className="
              flex
              flex-col
              items-center
              text-sm
            "

          >

            👥

            <span>
              Personas
            </span>

          </button>







          <button

            onClick={()=>setVista("notificaciones")}

            className="
              relative
              flex
              flex-col
              items-center
              text-sm
            "

          >

            🔔



            {
              notificaciones > 0 && (

                <span className="
                  absolute
                  -top-2
                  bg-red-500
                  rounded-full
                  px-2
                  text-xs
                ">

                  {notificaciones}

                </span>

              )

            }



            <span>
              Avisos
            </span>


          </button>








          <button

            onClick={()=>setVista("matches")}

            className="
              flex
              flex-col
              items-center
              text-sm
            "

          >

            🎉

            <span>
              Match
            </span>

          </button>









          <button

            onClick={()=>setVista("chats")}

            className="
              relative
              flex
              flex-col
              items-center
              text-sm
            "

          >

            💬



            {
              chatsNoLeidos > 0 && (

                <span className="
                  absolute
                  -top-2
                  bg-red-500
                  rounded-full
                  px-2
                  text-xs
                ">

                  {chatsNoLeidos}

                </span>

              )

            }



            <span>
              Chat
            </span>


          </button>









          <button

            onClick={()=>setVista("perfil")}

            className="
              flex
              flex-col
              items-center
              text-sm
            "

          >

            👤

            <span>
              Perfil
            </span>

          </button>







        </div>


      </nav>



    </main>

  );


}