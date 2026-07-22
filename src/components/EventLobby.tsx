"use client";

import { useEffect, useState } from "react";
import { getEventUsers } from "@/lib/events";


export default function EventLobby({
  eventoId
}: {
  eventoId: string;
}) {


  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);



  useEffect(() => {

    async function cargarUsuarios() {

      const resultado = await getEventUsers(eventoId);

      setUsuarios(resultado);

      setCargando(false);

    }


    cargarUsuarios();


  }, [eventoId]);





  if (cargando) {

    return (
      <div className="text-center mt-6 text-gray-500">
        Cargando participantes...
      </div>
    );

  }





  return (

    <div className="mt-8">


      <h2 className="text-xl font-bold text-gray-800 text-center">

        👥 Participantes ({usuarios.length})

      </h2>



      <div className="mt-5 space-y-3">


        {usuarios.map((usuario) => (

          <div
            key={usuario.id}
            className="
              flex
              items-center
              gap-4
              bg-gray-100
              rounded-xl
              p-3
            "
          >


            <img
              src={usuario.foto}
              alt={usuario.nombre}
              className="
                w-12
                h-12
                rounded-full
              "
            />


            <div>

              <p className="font-semibold text-gray-800">
                {usuario.nombre}
              </p>


              <p className="text-sm text-gray-500">
                Participante
              </p>

            </div>


          </div>

        ))}


      </div>


    </div>

  );

}