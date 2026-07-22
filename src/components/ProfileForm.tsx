"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { updateUserProfile } from "@/lib/users";

export default function ProfileForm() {

  const { user } = useUser();

  const [genero, setGenero] = useState("");
  const [guardando, setGuardando] = useState(false);


  async function handleSave() {

    if (!user || !genero) {
      return;
    }

    setGuardando(true);

    await updateUserProfile(user.uid, {
      genero,
    });

    setGuardando(false);
  }


  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

      <div className="text-center">

        <img
          src={user?.photoURL || ""}
          alt="foto de perfil"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />

        <h1 className="text-2xl font-bold text-gray-800">
          Hola {user?.displayName} 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Completá tu perfil para participar en la fiesta
        </p>

      </div>


      <div className="mt-8">

        <label className="block mb-2 font-semibold text-gray-700">
          Soy:
        </label>

        <select
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          className="
            w-full
            border
            border-gray-700
            rounded-xl
            p-3
            bg-black
            text-white
          "
        >
          <option value="">
            Elegir
          </option>

          <option value="hombre">
            Hombre
          </option>

          <option value="mujer">
            Mujer
          </option>

        </select>


        <button
          onClick={handleSave}
          disabled={guardando}
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
            hover:opacity-90
            transition
          "
        >
          {guardando ? "Guardando..." : "Guardar perfil"}
        </button>

      </div>

    </div>
  );
}