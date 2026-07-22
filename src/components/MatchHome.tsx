"use client";

import { useUser } from "@/context/UserContext";

export default function MatchHome() {

  const { user } = useUser();

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">

      <h1 className="text-3xl font-bold text-gray-800">
        Bienvenido a PartyMatch 🎉
      </h1>

      <p className="mt-4 text-gray-600">
        Hola {user?.displayName}
      </p>

      <p className="mt-8 text-purple-600 font-semibold">
        Próximamente empezaremos a mostrar coincidencias ❤️
      </p>

    </div>
  );
}