"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


type Usuario = {
  nombre?: string;
  foto?: string;
  edad?: string;
  genero?: string;
  busca?: string;
  intereses?: string[];
  email?: string;
};



export default function PerfilUsuarioPage(){


  const params = useParams();

  const id = params.id as string;



  const [usuario,setUsuario] =
    useState<Usuario | null>(null);


  const [cargando,setCargando] =
    useState(true);





  async function cargarUsuario(){


    try{


      const referencia =
        doc(
          db,
          "usuarios",
          id
        );


      const resultado =
        await getDoc(referencia);



      if(resultado.exists()){


        setUsuario(
          resultado.data() as Usuario
        );


      }



    }catch(error){


      console.error(
        "Error cargando perfil:",
        error
      );


    }finally{


      setCargando(false);


    }


  }





  useEffect(()=>{


    if(id){

      cargarUsuario();

    }


  },[id]);







  if(cargando){


    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Cargando perfil...

      </div>

    );


  }






  if(!usuario){


    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Usuario no encontrado.

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
        max-w-md
        mx-auto
        bg-white
        rounded-3xl
        shadow-lg
        p-8
        text-center
      ">



        {
          usuario.foto ? (

            <img

              src={usuario.foto}

              className="
                w-40
                h-40
                rounded-full
                object-cover
                mx-auto
                mb-6
              "

              alt="Perfil"

            />

          ) : (


            <div className="
              w-40
              h-40
              rounded-full
              bg-gray-300
              mx-auto
              mb-6
              flex
              items-center
              justify-center
              text-5xl
            ">

              👤

            </div>


          )

        }





        <h1 className="
          text-3xl
          font-bold
          text-black
        ">


          {usuario.nombre}


        </h1>





        {
          usuario.edad && (

            <p className="text-gray-600 mt-2">

              Edad: {usuario.edad}

            </p>

          )
        }






        {
          usuario.genero && (

            <p className="text-gray-600">

              Género: {usuario.genero}

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






        {
          usuario.intereses &&
          usuario.intereses.length > 0 && (


            <div className="mt-6">


              <h2 className="
                font-bold
                text-black
                mb-3
              ">

                Intereses

              </h2>



              <div className="
                flex
                flex-wrap
                justify-center
                gap-2
              ">


                {
                  usuario.intereses.map(
                    (interes,index)=>(

                      <span

                        key={index}

                        className="
                          bg-blue-100
                          text-blue-800
                          px-3
                          py-1
                          rounded-full
                        "

                      >

                        {interes}

                      </span>

                    )
                  )

                }


              </div>


            </div>


          )

        }





      </div>


    </main>


  );


}