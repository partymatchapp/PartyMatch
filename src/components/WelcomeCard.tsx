"use client";

import { loginWithGoogle } from "@/lib/auth";

export default function WelcomeCard() {

  async function handleLogin() {
    const user = await loginWithGoogle();

    if (!user) {
      return;
    }

    console.log("Usuario:", user);
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">

      <div className="text-6xl mb-6">
        ❤️
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        PartyMatch
      </h1>

      <p className="text-gray-600 mb-8">
        Conocé personas que también quieren conocerte en la fiesta.
      </p>

      <button
        onClick={handleLogin}
        className="w-full bg-black text-white py-4 rounded-full font-semibold hover:opacity-80"
      >
        Continuar con Google
      </button>

      <p className="text-xs text-gray-400 mt-6">
        Al ingresar aceptás las reglas del evento.
      </p>

    </div>
  );
}