"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";

import { getEvent } from "@/lib/events";

import {
  getUserProfile,
} from "@/lib/users";

import {
  getUnreadNotificationsCount,
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


export default function EventoPage() {

  const params = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();

  const id = params.id as string;


  const {
    user,
    loading,
  } = useUser();


  const [evento, setEvento] = useState<any>(null);

  const [cargandoEvento, setCargandoEvento] = useState(true);

  const [verificandoUsuario, setVerificandoUsuario] = useState(true);

  const [error, setError] = useState("");


  const [vista, setVista] = useState<Vista>(() => {

    const vistaUrl = searchParams.get("vista");

    if (
      vistaUrl === "chats" ||
      vistaUrl === "matches" ||
      vistaUrl === "notificaciones" ||
      vistaUrl === "participantes" ||
      vistaUrl === "discovery" ||
      vistaUrl === "perfil"
    ) {

      return vistaUrl;

    }

    return "discovery";

  });


  const [notificaciones, setNotificaciones] = useState(0);

  const [chatsNoLeidos, setChatsNoLeidos] = useState(0);


  // ======================================================
  // CARGAR EVENTO
  // ======================================================

  useEffect(() => {

    if (!id) {

      setError(
        "Evento inválido"
      );

      setCargandoEvento(false);

      return;

    }


    let activo = true;


    async function cargarEvento() {

      try {

        console.log(
          "⏳ Cargando evento:",
          id
        );


        const datos = await getEvent(
          id
        );


        console.log(
          "📦 Resultado evento:",
          datos
        );


        if (!activo) {
          return;
        }


        if (!datos) {

          setError(
            "Evento no encontrado"
          );

          setEvento(null);

          return;

        }


        setEvento(
          datos
        );

        setError("");


        console.log(
          "✅ Evento cargado correctamente"
        );


      } catch (error: any) {

        console.error(
          "❌ Error cargando evento:",
          error
        );


        if (activo) {

          setError(
            error?.message ||
            "No se pudo cargar el evento"
          );

        }

      } finally {

        if (activo) {

          setCargandoEvento(false);

        }

      }

    }


    cargarEvento();


    return () => {

      activo = false;

    };

  }, [id]);


  // ======================================================
  // AUTENTICACIÓN Y PERFIL
  // ======================================================

  useEffect(() => {

    if (loading) {
      return;
    }


    if (!id) {
      return;
    }


    let activo = true;


    async function verificarUsuario() {

      try {

        console.log(
          "🔐 Verificando usuario..."
        );


        if (!user) {

          console.log(
            "⚠️ No hay usuario autenticado"
          );


          router.push(
            `/login?evento=${id}`
          );


          return;

        }


        console.log(
          "✅ Usuario autenticado:",
          user.uid
        );


        const perfil =
          await getUserProfile(
            user.uid
          );


        console.log(
          "👤 Perfil:",
          perfil
        );


        if (!perfil) {

          console.log(
            "⚠️ No existe el perfil"
          );


          router.push(
            `/crear-perfil?evento=${id}`
          );


          return;

        }


        if (!perfil.perfilCompleto) {

          console.log(
            "⚠️ Perfil incompleto"
          );


          router.push(
            `/crear-perfil?evento=${id}`
          );


          return;

        }


        console.log(
          "✅ Perfil completo"
        );


        // ==================================================
        // IMPORTANTE
        //
        // NO hacemos joinEvent() acá.
        //
        // Antes el usuario era agregado automáticamente
        // cada vez que abría /evento/[id].
        //
        // Eso hacía que un participante eliminado por el
        // administrador volviera a aparecer.
        // ==================================================


        console.log(
          "📌 eventoId actual del usuario:",
          perfil.eventoId
        );


        if (
          perfil.eventoId !== id
        ) {

          console.log(
            "⚠️ El usuario no pertenece actualmente a este evento"
          );


          setError(
            "No estás participando actualmente de este evento."
          );


          return;

        }


        console.log(
          "🎉 Usuario pertenece al evento:",
          id
        );


        // ==================================================
        // NOTIFICACIONES
        // ==================================================

        try {

          const cantidad =
            await getUnreadNotificationsCount(
              user.uid
            );


          if (activo) {

            setNotificaciones(
              cantidad
            );

          }


        } catch (error) {

          console.error(
            "⚠️ Error cargando notificaciones:",
            error
          );

        }


      } catch (error: any) {

        console.error(
          "❌ Error verificando usuario:",
          error
        );


        if (activo) {

          setError(
            error?.message ||
            "No se pudo verificar el usuario"
          );

        }

      } finally {

        if (activo) {

          setVerificandoUsuario(false);

        }

      }

    }


    verificarUsuario();


    return () => {

      activo = false;

    };


  }, [
    id,
    user,
    loading,
    router
  ]);


  // ======================================================
  // CHAT - MENSAJES NO LEÍDOS
  // ======================================================

  useEffect(() => {

    if (!user) {
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

      (snapshot) => {

        let total = 0;


        snapshot.forEach((doc) => {

          const data: any =
            doc.data();


          total +=
            data.noLeidos?.[user.uid] || 0;

        });


        setChatsNoLeidos(
          total
        );

      },

      (error) => {

        console.error(
          "❌ Error escuchando chats:",
          error
        );

      }

    );


    return () => {

      cancelar();

    };

  }, [user]);


  // ======================================================
  // CARGANDO AUTENTICACIÓN
  // ======================================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        flex-col
        items-center
        justify-center
        gap-4
      ">

        <div className="text-4xl">
          🎉
        </div>

        <div>
          Verificando usuario...
        </div>

      </div>

    );

  }


  // ======================================================
  // CARGANDO EVENTO
  // ======================================================

  if (cargandoEvento) {

    return (

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        flex-col
        items-center
        justify-center
        gap-4
      ">

        <div className="text-4xl">
          🎉
        </div>

        <div>
          Cargando evento...
        </div>

        <div className="
          text-xs
          text-gray-500
        ">

          ID: {id}

        </div>

      </div>

    );

  }


  // ======================================================
  // VERIFICANDO USUARIO
  // ======================================================

  if (verificandoUsuario) {

    return (

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        flex-col
        items-center
        justify-center
        gap-4
      ">

        <div className="text-4xl">
          🎉
        </div>

        <div>
          Verificando participación...
        </div>

      </div>

    );

  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error) {

    return (

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        flex-col
        items-center
        justify-center
        p-6
        text-center
      ">

        <div className="text-5xl mb-4">
          ⚠️
        </div>


        <h1 className="
          text-2xl
          font-bold
          mb-3
        ">

          No se pudo acceder al evento

        </h1>


        <p className="
          text-gray-400
          mb-6
        ">

          {error}

        </p>


        <button

          onClick={() =>
            router.push("/")
          }

          className="
            bg-purple-600
            hover:bg-purple-700
            px-6
            py-3
            rounded-xl
            font-bold
          "

        >

          Volver al inicio

        </button>

      </div>

    );

  }


  // ======================================================
  // EVENTO NO ENCONTRADO
  // ======================================================

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


  // ======================================================
  // PÁGINA PRINCIPAL
  // ======================================================

  return (

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


        {vista === "discovery" && (

          <Discovery
            eventoId={id}
          />

        )}


        {vista === "participantes" && (

          <EventLobby
            eventoId={id}
          />

        )}


        {vista === "notificaciones" && (

          <Notifications />

        )}


        {vista === "matches" && (

          <Matches />

        )}


        {vista === "chats" && (

          <Chats
            onUnreadChange={
              setChatsNoLeidos
            }
          />

        )}


        {vista === "perfil" && (

          <MiPerfil />

        )}


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

            onClick={() =>
              setVista("discovery")
            }

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

            onClick={() =>
              setVista("participantes")
            }

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

            onClick={() =>
              setVista("notificaciones")
            }

            className="
              relative
              flex
              flex-col
              items-center
              text-sm
            "

          >

            🔔


            {notificaciones > 0 && (

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

            )}


            <span>
              Avisos
            </span>

          </button>


          <button

            onClick={() =>
              setVista("matches")
            }

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

            onClick={() =>
              setVista("chats")
            }

            className="
              relative
              flex
              flex-col
              items-center
              text-sm
            "

          >

            💬


            {chatsNoLeidos > 0 && (

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

            )}


            <span>
              Chat
            </span>

          </button>


          <button

            onClick={() =>
              setVista("perfil")
            }

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