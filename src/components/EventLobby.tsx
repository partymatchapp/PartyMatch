"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getEventUsers } from "@/lib/events";


export default function EventLobby({
  eventoId
}: {
  eventoId:string;
}) {


  const router = useRouter();


  const [usuarios,setUsuarios] = useState<any[]>([]);
  const [cargando,setCargando] = useState(true);




  useEffect(()=>{


    let activo = true;


    async function cargarUsuarios(){


      try{


        const resultado = await getEventUsers(
          eventoId
        );


        if(activo){

          setUsuarios(resultado);

        }


      }catch(error){


        console.error(
          "Error cargando participantes:",
          error
        );


      }finally{


        if(activo){

          setCargando(false);

        }


      }


    }




    cargarUsuarios();



    const intervalo = setInterval(()=>{

      cargarUsuarios();

    },3000);





    return ()=>{


      activo=false;

      clearInterval(intervalo);


    };


  },[eventoId]);








  if(cargando){


    return(

      <div className="
        text-center
        mt-6
        text-gray-500
      ">

        Cargando participantes...

      </div>

    );

  }








  return(

    <div className="mt-8">


      <h2 className="
        text-xl
        font-bold
        text-white
        text-center
      ">

        👥 Participantes ({usuarios.length})

      </h2>








      {
        usuarios.length === 0 ? (

          <p className="
            text-center
            text-gray-400
            mt-5
          ">

            Esperando participantes...

          </p>


        ) : (



          <div className="
            mt-5
            space-y-3
          ">


            {
              usuarios.map((usuario)=>(


                <button

                  key={usuario.id}

                  onClick={()=>{

                    router.push(
                      `/perfil/${usuario.id}?evento=${eventoId}`
                    );

                  }}

                  className="
                    w-full
                    flex
                    items-center
                    gap-4
                    bg-gray-100
                    rounded-xl
                    p-3
                    text-left
                  "

                >



                  {
                    usuario.foto ? (


                      <img

                        src={usuario.foto}

                        alt="foto"

                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                        "

                      />


                    ) : (


                      <div className="
                        w-12
                        h-12
                        rounded-full
                        bg-gray-300
                        flex
                        items-center
                        justify-center
                        text-2xl
                      ">

                        👤

                      </div>


                    )

                  }






                  <div>

                    <p className="
                      font-semibold
                      text-gray-800
                    ">

                      {usuario.nombre || "Participante"}

                    </p>



                    <p className="
                      text-sm
                      text-gray-500
                    ">

                      Ver perfil

                    </p>


                  </div>




                </button>


              ))
            }



          </div>


        )
      }



    </div>


  );


}