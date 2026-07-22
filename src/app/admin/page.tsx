"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { createEvent } from "@/lib/events";


export default function AdminPage() {

  const { user } = useUser();

  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [creando, setCreando] = useState(false);


  async function handleCreate() {

    if (!user || !nombre || !fecha) {
      return;
    }


    setCreando(true);


    await createEvent(
      nombre,
      fecha,
      user.uid
    );


    setCreando(false);


    setNombre("");
    setFecha("");

  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">


        <div className="text-center">

          <div className="text-5xl mb-4">
            🎉
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Panel Admin PartyMatch
          </h1>

          <p className="text-gray-500 mt-4">
            Crear un nuevo evento
          </p>

        </div>



        <div className="mt-8">

          <input
            value={nombre}
            onChange={(e)=>setNombre(e.target.value)}
            placeholder="Nombre del evento"
            className="
              w-full
              border
              rounded-xl
              p-3
              mb-4
              text-black
            "
          />


          <input
            type="date"
            value={fecha}
            onChange={(e)=>setFecha(e.target.value)}
            className="
              w-full
              border
              rounded-xl
              p-3
              text-black
            "
          />


          <button
            onClick={handleCreate}
            disabled={creando}
            className="
              w-full
              mt-6
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
            {creando ? "Creando..." : "Crear evento"}
          </button>


        </div>

      </div>

    </main>
  );
}