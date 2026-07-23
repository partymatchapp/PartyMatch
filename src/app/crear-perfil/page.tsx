import { Suspense } from "react";
import CrearPerfil from "./CrearPerfil";


export default function Page(){

  return (

    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Cargando...
        </div>
      }
    >

      <CrearPerfil />

    </Suspense>

  );

}