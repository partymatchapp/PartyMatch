"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();


  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-900
    ">


      <div className="
        bg-white
        rounded-2xl
        shadow-xl
        p-8
        w-full
        max-w-md
        text-center
      ">


        <h1 className="
          text-3xl
          font-bold
          text-black
          mb-4
        ">
          PartyMatch 🎉
        </h1>


        <p className="
          text-gray-600
          mb-8
        ">
          Creá tu perfil para participar.
        </p>



        <button

          onClick={() => router.push("/crear-perfil")}

          className="
            w-full
            bg-purple-600
            hover:bg-purple-700
            text-white
            font-bold
            py-3
            rounded-xl
            mb-4
          "

        >

          👤 Crear mi perfil

        </button>




        <button

          onClick={() => router.push("/admin")}

          className="
            w-full
            bg-slate-900
            hover:bg-black
            text-white
            font-bold
            py-3
            rounded-xl
          "

        >

          🔐 Administrador

        </button>



      </div>


    </main>

  );

}