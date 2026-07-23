"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function EventQR({
  eventoId
}: {
  eventoId: string;
}) {

  const [mostrar, setMostrar] = useState(false);


  const enlace =
    `${window.location.origin}/evento/${eventoId}`;


  async function copiarEnlace(){

    await navigator.clipboard.writeText(enlace);

    alert("✅ Enlace copiado");

  }


  return (

    <>

      <button
        onClick={()=>setMostrar(true)}
        className="
          bg-black
          text-white
          px-4
          py-2
          rounded-xl
        "
      >
        📱 QR
      </button>



      {
        mostrar && (

          <div
            className="
              fixed
              inset-0
              bg-black/70
              flex
              items-center
              justify-center
              z-50
            "
          >

            <div
              className="
                bg-white
                rounded-2xl
                p-8
                text-center
              "
            >

              <h2 className="text-xl font-bold mb-5 text-black">
                Escaneá para entrar
              </h2>


              <QRCodeSVG
                value={enlace}
                size={220}
              />


              <button
                onClick={copiarEnlace}
                className="
                  mt-5
                  bg-blue-600
                  text-white
                  px-5
                  py-3
                  rounded-xl
                "
              >
                🔗 Copiar enlace
              </button>


              <button
                onClick={()=>setMostrar(false)}
                className="
                  mt-3
                  block
                  mx-auto
                  text-gray-600
                "
              >
                Cerrar
              </button>


            </div>


          </div>

        )
      }


    </>

  );

}