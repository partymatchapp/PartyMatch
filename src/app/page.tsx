"use client";

import { useEffect, useState } from "react";

import WelcomeCard from "@/components/WelcomeCard";
import ProfileForm from "@/components/ProfileForm";
import MatchHome from "@/components/MatchHome";

import { useUser } from "@/context/UserContext";
import { getUserProfile } from "@/lib/users";


export default function Home() {

  const { user, loading } = useUser();

  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);


  useEffect(() => {

    async function cargarPerfil() {

      if (!user) {
        setCargandoPerfil(false);
        return;
      }

      const perfil = await getUserProfile(user.uid);

      setPerfilCompleto(
        perfil?.perfilCompleto === true
      );

      setCargandoPerfil(false);
    }


    cargarPerfil();

  }, [user]);


  if (loading || cargandoPerfil) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Cargando...
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center p-6">

      {!user && (
        <WelcomeCard />
      )}

      {user && !perfilCompleto && (
        <ProfileForm />
      )}

      {user && perfilCompleto && (
        <MatchHome />
      )}

    </main>
  );
}