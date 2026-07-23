"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getEvent, getEventUsers } from "@/lib/events";


type Usuario = {
  id: string;
  nombre?: string;
  displayName?: string;
  foto?: string;
  email?: string;
  edad?: string;
  genero?: string;
  busca?: string;
  intereses?: string[];
  eventoId?: string;
};



export default function EventoAdminPage(){


  const params = useParams();

  const router = useRouter();


  const id = params.id as string;



  const [evento,setEvento] = useState<any>(null);

  const [usuarios,setUsuarios] =
    useState<Usuario[]>([]);

  const [cargando,setCargando] =
    useState(true);





  async function cargarDatos(){


    try{


      const datosEvento =
        await getEvent(id);



      const participantes =
        await getEventUsers(id);



      setEvento(datosEvento);

      setUsuarios(
        participantes as Usuario[]
      );



    }catch(error){


      console.error(
        "Error cargando participantes:",
        error
      );


    }finally{


      setCargando(false);


    }


  }





  useEffect(()=>{


    if(id){

      cargarDatos();

    }


  },[id]);







  if(cargando){


    return (

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        Cargando evento...

      </div>

    );


  }







  return (


    <main className="
      min-h-screen
      bg-slate-100
      p-6
    ">


      <div className="
        max-w-5xl
        mx-auto
      ">



        <h1 className="
          text-3xl
          font-bold
          text-black
          mb-2
        ">

          🎉 {evento?.nombre}

        </h1>



        <p className="
          text-gray-600
          mb-8
        ">

          Participantes: {usuarios.length}

        </p>






        {
          usuarios.length === 0 ? (


            <p className="text-gray-500">

              Todavía no hay participantes.

            </p>



          ) : (


            <div className="
              grid
              md:grid-cols-2
              gap-4
            ">



              {
                usuarios.map((usuario)=>(


                  <div

                    key={usuario.id}

                    onClick={()=> 
                      router.push(
                        `/admin/usuario/${usuario.id}`
                      )
                    }

                    className="
                      bg-white
                      rounded-2xl
                      shadow
                      p-5
                      cursor-pointer
                      hover:shadow-xl
                      transition
                    "

                  >



                    <div className="
                      flex
                      items-center
                      gap-4
                    ">



                      {
                        usuario.foto ? (

                          <img

                            src={usuario.foto}

                            alt={
                              usuario.nombre ||
                              "Usuario"
                            }

                            className="
                              w-20
                              h-20
                              rounded-full
                              object-cover
                            "

                          />

                        ) : (


                          <div className="
                            w-20
                            h-20
                            rounded-full
                            bg-gray-300
                            flex
                            items-center
                            justify-center
                            text-3xl
                          ">

                            👤

                          </div>


                        )
                      }





                      <div>


                        <h2 className="
                          text-xl
                          font-bold
                          text-black
                        ">


                          {
                            usuario.nombre ||
                            usuario.displayName ||
                            "Usuario"
                          }


                        </h2>




                        {
                          usuario.edad && (

                            <p className="text-gray-600">

                              Edad: {usuario.edad}

                            </p>

                          )
                        }





                        {
                          usuario.busca && (

                            <p className="text-gray-600">

                              Busca: {usuario.busca}

                            </p>

                          )
                        }



                      </div>



                    </div>



                  </div>


                ))

              }



            </div>


          )

        }




      </div>


    </main>


  );


}