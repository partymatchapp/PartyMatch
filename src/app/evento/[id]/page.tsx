"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getEvent } from "@/lib/events";
import { useUser } from "@/context/UserContext";
import { joinEvent } from "@/lib/users";
import EventLobby from "@/components/EventLobby";


export default function EventoPage() {

  const params = useParams();

  const eventoId = params.id as string;

  const { user } = useUser();


  const [evento, setEvento] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [uniendo, setUniendo] = useState(false);



  useEffect(() => {

    async function cargarEvento() {

      const resultado = await getEvent(eventoId);

      setEvento(resultado);

      setCargando(false);

    }


    if (eventoId) {
      cargarEvento();
    }

  }, [eventoId]);




  async function handleJoin() {

    if (!user) {

      alert("Primero iniciá sesión");

      return;

    }


    setUniendo(true);


    await joinEvent(
      user.uid,
      eventoId
    );


    setUniendo(false);


    alert("🎉 Ya estás unido al evento");

  }





  if (cargando) {

    return (
      <main className="min-h-screen flex items-center justify-center">
        Cargando evento...
      </main>
    );

  }




  if (!evento) {

    return (
      <main className="min-h-screen flex items-center justify-center">
        Evento no encontrado
      </main>
    );

  }





  return (

    <main className="
      min-h-screen
      bg-gradient-to-br
      from-purple-600
      to-pink-500
      flex
      items-center
      justify-center
      p-6
    ">


      <div className="
        w-full
        max-w-md
        bg-white
        rounded-3xl
        shadow-2xl
        p-8
      ">


        <div className="text-center">


          <div className="text-5xl mb-4">
            🎉
          </div>


          <h1 className="text-3xl font-bold text-gray-800">
            {evento.nombre}
          </h1>


          <p className="text-gray-500 mt-4">
            Fecha:
          </p>


          <p className="font-semibold text-purple-600">
            {evento.fecha}
          </p>



          <button
            onClick={handleJoin}
            disabled={uniendo}
            className="
              w-full
              mt-8
              bg-gradient-to-r
              from-purple-600
              to-pink-500
              text-white
              py-3
              rounded-xl
              font-semibold
              shadow-lg
            "
          >

            {uniendo
              ? "Uniéndome..."
              : "Unirme al evento"
            }

          </button>


        </div>


        <EventLobby eventoId={eventoId} />


      </div>


    </main>

  );

}