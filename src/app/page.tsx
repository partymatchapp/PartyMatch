"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";
import { getUserProfile } from "@/lib/users";
import { loginWithUsername } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  const { user, loading } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [entrando, setEntrando] = useState(false);
  const [error, setError] = useState("");

  const [buscandoPerfil, setBuscandoPerfil] = useState(false);
  const [redireccionando, setRedireccionando] = useState(false);

  // ======================================================
  // COMPROBAR USUARIO Y EVENTO
  // ======================================================

  useEffect(() => {
    let cancelado = false;

    async function comprobarUsuario() {
      // Firebase todavía está comprobando la sesión
      if (loading) {
        console.log("⏳ Esperando Firebase...");
        return;
      }

      // No hay usuario autenticado
      if (!user) {
        console.log("🏠 No hay usuario autenticado");

        if (!cancelado) {
          setBuscandoPerfil(false);
        }

        return;
      }

      console.log(
        "👤 Usuario autenticado:",
        user.uid
      );

      if (!cancelado) {
        setBuscandoPerfil(true);
      }

      try {
        console.log(
          "🔎 Buscando perfil:",
          user.uid
        );

        const perfil = await getUserProfile(user.uid);

        if (cancelado) {
          return;
        }

        console.log(
          "👤 Perfil obtenido:",
          perfil
        );

        // --------------------------------------------------
        // NO EXISTE PERFIL
        // --------------------------------------------------

        if (!perfil) {
          console.log(
            "⚠️ No existe perfil para este usuario"
          );

          setBuscandoPerfil(false);

          return;
        }

        console.log(
          "📌 eventoId:",
          perfil.eventoId
        );

        // --------------------------------------------------
        // USUARIO TIENE EVENTO
        // --------------------------------------------------

        if (
          perfil.eventoId &&
          perfil.eventoId.trim() !== ""
        ) {
          console.log(
            "🎉 Usuario tiene evento:",
            perfil.eventoId
          );

          setRedireccionando(true);

          router.replace(
            `/evento/${perfil.eventoId}`
          );

          return;
        }

        // --------------------------------------------------
        // USUARIO SIN EVENTO
        // --------------------------------------------------

        console.log(
          "🏠 Usuario sin evento"
        );

        setBuscandoPerfil(false);

      } catch (error) {
        console.error(
          "❌ Error cargando perfil:",
          error
        );

        if (!cancelado) {
          setBuscandoPerfil(false);
        }
      }
    }

    comprobarUsuario();

    return () => {
      cancelado = true;
    };
  }, [user, loading, router]);


  // ======================================================
  // LOGIN
  // ======================================================

  async function handleLogin() {
    setError("");

    if (!username.trim() || !password) {
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

      const usuario = await loginWithUsername(
        username,
        password
      );

      if (!usuario) {
        console.log(
          "❌ Login rechazado"
        );

        setError(
          "Usuario o contraseña incorrectos."
        );

        setEntrando(false);

        return;
      }

      console.log(
        "✅ Login correcto:",
        usuario.uid
      );

      /*
       * NO hacemos router.push("/") acá.
       *
       * Firebase actualizará UserContext.
       * El useEffect de arriba detectará el usuario,
       * cargará su perfil y decidirá si debe ir
       * al evento.
       */

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
  // CARGANDO FIREBASE
  // ======================================================

  if (loading) {
    return (
      <main className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
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
            Conectando con PartyMatch...
          </p>
        </div>
      </main>
    );
  }


  // ======================================================
  // BUSCANDO PERFIL
  // ======================================================

  if (user && (buscandoPerfil || redireccionando)) {
    return (
      <main className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
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
            {redireccionando
              ? "Entrando al evento..."
              : "Cargando tu perfil..."
            }
          </p>
        </div>
      </main>
    );
  }


  // ======================================================
  // PÁGINA PRINCIPAL / LOGIN
  // ======================================================

  return (
    <main className="
      min-h-screen
      bg-slate-900
      flex
      items-center
      justify-center
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

        {/* ==================================================
            TÍTULO
        ================================================== */}

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
            setUsername(e.target.value)
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
            setPassword(e.target.value)
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
            INGRESAR
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
          onClick={() =>
            router.push("/crear-perfil")
          }
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