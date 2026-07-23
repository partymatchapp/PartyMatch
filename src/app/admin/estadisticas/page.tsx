"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getEventMatches
} from "@/lib/events";

import {
  collection,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";


type Usuario = {
  id:string;
  nombre?:string;
  foto?:string;
};


type Match = {
  id:string;
  usuarios:string[];
};



export default function EstadisticasPage(){


  const params = useParams();

  const id = params.id as string;



  const [matches,setMatches] =
    useState<any[]>([]);


  const [cargando,setCargando] =
    useState(true);





  async function cargarMatches(){


    try{


      const datos =
        await getEventMatches(id);



      const lista:any[] = [];



      for(const match of datos as Match[]){


        const usuariosMatch = [];



        for(const usuarioId of match.usuarios){


          const usuarioRef = doc(
            db,
            "usuarios",
            usuarioId
          );


          const usuarioSnap =
            await getDoc(usuarioRef);



          if(usuarioSnap.exists()){


            usuariosMatch.push({

              id:usuarioSnap.id,

              ...usuarioSnap.data()

            });


          }


        }



        lista.push({

          id:match.id,

          usuarios:usuariosMatch

        });



      }



      setMatches(lista);



    }catch(error){


      console.error(
        "Error cargando matches:",
        error
      );


    }finally{


      setCargando(false);


    }


  }







  useEffect(()=>{


    if(id){

      cargarMatches();

    }


  },[id]);









  if(cargando){


    return (

      <main className="
        min-h-screen
        bg-slate-100
        flex
        items-center
        justify-center
      ">

        Cargando estadísticas...

      </main>

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
          mb-8
        ">

          📊 Estadísticas del evento

        </h1>



        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-6
        ">

          <p className="
            text-xl
            font-bold
            text-black
          ">

            ❤️ Matches realizados:
            {" "}
            {matches.length}

          </p>


        </div>






        {
          matches.length === 0 ? (

            <p className="text-gray-500">

              Todavía no hay matches.

            </p>


          ) : (


            <div className="
              grid
              gap-5
            ">


              {
                matches.map((match)=>(


                  <div

                    key={match.id}

                    className="
                      bg-white
                      rounded-2xl
                      shadow
                      p-6
                      flex
                      justify-center
                      items-center
                      gap-8
                    "

                  >



                    {
                      match.usuarios.map(
                        (usuario:any)=>(
                          

                        <div
                          key={usuario.id}
                          className="
                            text-center
                          "
                        >


                          {
                            usuario.foto ? (

                              <img

                                src={usuario.foto}

                                className="
                                  w-28
                                  h-28
                                  rounded-full
                                  object-cover
                                  mx-auto
                                "

                                alt="Foto"

                              />

                            ) : (

                              <div className="
                                w-28
                                h-28
                                rounded-full
                                bg-gray-300
                                flex
                                items-center
                                justify-center
                                text-4xl
                                mx-auto
                              ">

                                👤

                              </div>

                            )


                          }


                          <h2 className="
                            text-xl
                            font-bold
                            text-black
                            mt-3
                          ">

                            {
                              usuario.nombre ||
                              "Usuario"
                            }

                          </h2>


                        </div>


                        )
                      )

                    }



                    <div className="
                      text-4xl
                    ">

                      ❤️

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