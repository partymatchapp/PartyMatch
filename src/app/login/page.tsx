"use client";

import {
  Suspense,
  useState
} from "react";

import {
  useRouter,
  useSearchParams
} from "next/navigation";

import { loginWithUsername } from "@/lib/auth";


// ======================================================
// CONTENIDO DEL LOGIN
// ======================================================

function LoginContent() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const eventoId =
    searchParams.get("evento");


  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [entrando, setEntrando] =
    useState(false);

  const [error, setError] =
    useState("");


  // ======================================================
  // LOGIN
  // ======================================================

  async function handleLogin() {

    setError("");


    if (
      !username.trim() ||
      !password
    ) {

      setError(
        "Ingresá tu usuario y contraseña."
      );

      return;

    }


    if (entrando) {
      return;
    }


    setEntrando(true);


    try {

      console.log(
        "⏳ Iniciando login:",
        username
      );


      const user =
        await loginWithUsername(
          username,
          password
        );


      if (!user) {

        setError(
          "Usuario o contraseña incorrectos."
        );

        return;

      }


      console.log(
        "✅ Usuario autenticado:",
        user.uid
      );


      // ==================================================
      // SI VENIMOS DESDE UN EVENTO
      // ==================================================

      if (eventoId) {

        console.log(
          "🎉 Login con evento:",
          eventoId
        );


        router.push(
          `/evento/${eventoId}`
        );


        return;

      }


      // ==================================================
      // LOGIN NORMAL
      // ==================================================

      console.log(
        "🏠 Login sin evento"
      );


      router.push("/");


    } catch (error) {

      console.error(
        "❌ Error entrando:",
        error
      );


      setError(
        "No se pudo iniciar sesión."
      );


    } finally {

      setEntrando(false);

    }

  }


  // ======================================================
  // PÁGINA
  // ======================================================

  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-900
      p-6
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
          mb-2
        ">

          PartyMatch 🎉

        </h1>


        <p className="
          text-gray-600
          mb-8
        ">

          Ingresá para continuar.

        </p>



        {/* ==================================================
            USUARIO
        ================================================== */}

        <input

          type="text"

          value={username}

          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }

          placeholder="Usuario"

          autoComplete="username"

          disabled={entrando}

          className="
            w-full
            border
            border-gray-300
            rounded-xl
            p-3
            text-black
            mb-4
            outline-none
            focus:ring-2
            focus:ring-purple-500
            disabled:bg-gray-100
          "

        />



        {/* ==================================================
            CONTRASEÑA
        ================================================== */}

        <input

          type="password"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          placeholder="Contraseña"

          autoComplete="current-password"

          disabled={entrando}

          onKeyDown={(e) => {

            if (e.key === "Enter") {

              handleLogin();

            }

          }}

          className="
            w-full
            border
            border-gray-300
            rounded-xl
            p-3
            text-black
            mb-4
            outline-none
            focus:ring-2
            focus:ring-purple-500
            disabled:bg-gray-100
          "

        />



        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div className="
            bg-red-100
            text-red-700
            rounded-xl
            p-3
            mb-4
            text-sm
            font-semibold
          ">

            {error}

          </div>

        )}



        {/* ==================================================
            LOGIN
        ================================================== */}

        <button

          onClick={handleLogin}

          disabled={entrando}

          className="
            w-full
            bg-purple-600
            hover:bg-purple-700
            disabled:bg-purple-300
            text-white
            font-bold
            py-3
            rounded-xl
            mb-4
          "

        >

          {entrando
            ? "Ingresando..."
            : "Ingresar"
          }

        </button>



        {/* ==================================================
            CREAR PERFIL
        ================================================== */}

        <button

          onClick={() => {

            if (eventoId) {

              router.push(
                `/crear-perfil?evento=${eventoId}`
              );

            } else {

              router.push(
                "/crear-perfil"
              );

            }

          }}

          disabled={entrando}

          className="
            w-full
            bg-black
            hover:bg-slate-800
            disabled:bg-gray-400
            text-white
            font-bold
            py-3
            rounded-xl
            mb-4
          "

        >

          👤 Crear mi perfil

        </button>



        {/* ==================================================
            ADMIN
        ================================================== */}

        <button

          onClick={() =>
            router.push("/admin")
          }

          disabled={entrando}

          className="
            w-full
            bg-slate-200
            hover:bg-slate-300
            disabled:bg-gray-300
            text-slate-900
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


// ======================================================
// PÁGINA LOGIN CON SUSPENSE
// ======================================================

export default function LoginPage() {

  return (

    <Suspense

      fallback={

        <main className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-black
          text-white
          p-6
        ">

          <div className="
            text-center
          ">

            <div className="
              text-5xl
              mb-4
            ">

              🎉

            </div>


            <p className="
              text-lg
              font-semibold
            ">

              Cargando PartyMatch...

            </p>

          </div>

        </main>

      }

    >

      <LoginContent />

    </Suspense>

  );

}