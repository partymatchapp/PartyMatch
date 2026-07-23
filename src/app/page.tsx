"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useUser } from "@/context/UserContext";

import { getEvent } from "@/lib/events";
import { joinEvent } from "@/lib/users";

import EventLobby from "@/components/EventLobby";
import Discovery from "@/components/Discovery";


export default function EventoPage() {


  const params = useParams();

  const id = params.id as string;

  const { user } = useUser();


  const [evento, setEvento] = useState<any>(null);

  const [cargando, setCargando] = useState(true);





  useEffect(() => {


    async function cargarEvento() {


      if (!id) return;


      const datos = await getEvent(id);


      setEvento(datos);

      setCargando(false);


    }


    cargarEvento();


  }, [id]);







  useEffect(() => {


    async function unirUsuario() {


      if (user && id) {


        await joinEvent(
          user.uid,
          id
        );


      }


    }


    unirUsuario();


  }, [user, id]);







  if (cargando) {


    return (

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







  if (!evento) {


    return (

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







  return (

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
          mt-10
        ">


          <Discovery
            eventoId={id}
          />


        </div>





      </div>


    </main>

  );

}