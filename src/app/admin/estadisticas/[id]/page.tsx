"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getEvent,
  getEventMatches
} from "@/lib/events";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";



type Usuario = {
  id:string;
  nombre?:string;
  foto?:string;
  edad?:string;
  genero?:string;
  busca?:string;
};



type Match = {
  id:string;
  eventoId:string;
  usuarios:string[];
};




export default function EstadisticasEventoPage(){


  const params = useParams();

  const router = useRouter();


  const id = params.id as string;



  const [evento,setEvento] =
    useState<any>(null);



  const [matches,setMatches] =
    useState<any[]>([]);



  const [cargando,setCargando] =
    useState(true);






  async function buscarUsuario(uid:string){


    const referencia =
      doc(
        db,
        "usuarios",
        uid
      );


    const resultado =
      await getDoc(referencia);



    if(resultado.exists()){


      return {

        id:resultado.id,

        ...resultado.data()

      } as Usuario;


    }


    return null;


  }








  async function cargarDatos(){


    try{


      const datosEvento =
        await getEvent(id);



      const datosMatches =
        await getEventMatches(id);




      const matchesCompletos =
        await Promise.all(


          (datosMatches as Match[]).map(
            async(match)=>{


              const usuarios =
                await Promise.all(


                  match.usuarios.map(
                    uid=>buscarUsuario(uid)
                  )


                );


              return {

                ...match,

                perfiles:
                  usuarios.filter(Boolean)

              };


            }


          )


        );





      setEvento(datosEvento);


      setMatches(
        matchesCompletos
      );



    }catch(error){


      console.error(
        "Error cargando estadísticas:",
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

      <main className="
        min-h-screen
        bg-black
        text-white
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



        <button

          onClick={()=>router.back()}

          className="
            mb-6
            bg-slate-900
            text-white
            px-5
            py-3
            rounded-xl
            font-bold
          "

        >

          ⬅️ Volver

        </button>





        <h1 className="
          text-3xl
          font-bold
          text-black
        ">

          📊 Estadísticas

        </h1>



        <h2 className="
          text-xl
          text-gray-700
          mb-8
        ">

          🎉 {evento?.nombre}

        </h2>







        <div className="
          bg-white
          rounded-2xl
          shadow
          p-8
          mb-8
        ">


          <h3 className="
            text-xl
            font-bold
            text-black
          ">

            ❤️ Total de matches

          </h3>


          <p className="
            text-5xl
            font-bold
            text-purple-600
            mt-3
          ">

            {matches.length}

          </p>


        </div>








        <div className="space-y-6">


        {
          matches.map((match)=>(


            <div

              key={match.id}

              className="
                bg-white
                rounded-2xl
                shadow
                p-6
              "

            >


              <h3 className="
                font-bold
                text-black
                mb-5
              ">

                ❤️ Match

              </h3>





              <div className="
                grid
                md:grid-cols-2
                gap-6
              ">



              {
                match.perfiles.map(
                  (usuario:Usuario)=>(


                    <div

                      key={usuario.id}

                      className="
                        flex
                        items-center
                        gap-4
                        border
                        rounded-xl
                        p-4
                      "

                    >


                      {
                        usuario.foto ? (

                          <img

                            src={usuario.foto}

                            className="
                              w-20
                              h-20
                              rounded-full
                              object-cover
                            "

                            alt="foto"

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


                        <p className="
                          font-bold
                          text-black
                          text-xl
                        ">

                          {usuario.nombre}

                        </p>



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


                  )
                )

              }



              </div>


            </div>


          ))

        }


        </div>



      </div>


    </main>

  );


}