"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";



type Match = {

  id:string;

  eventoId:string;

  usuarios:string[];

};



type Perfil = {

  nombre:string;

  foto:string;

};





export default function Matches(){



  const { user } = useUser();

  const router = useRouter();



  const [matches,setMatches] = useState<any[]>([]);

  const [cargando,setCargando] = useState(true);









  async function cargarMatches(){



    if(!user){

      return;

    }



    const q = query(

      collection(

        db,

        "matches"

      ),

      where(

        "usuarios",

        "array-contains",

        user.uid

      )

    );





    const snapshot = await getDocs(q);





    const lista:any[] = [];





    for(const item of snapshot.docs){



      const data = item.data() as Match;



      const otroUsuario = data.usuarios.find(

        (id)=>id !== user.uid

      );



      let perfil:Perfil = {

        nombre:"Usuario",

        foto:""

      };





      if(otroUsuario){



        const perfilSnap = await getDoc(

          doc(

            db,

            "usuarios",

            otroUsuario

          )

        );





        if(perfilSnap.exists()){


          const datos = perfilSnap.data();



          perfil = {

            nombre:datos.nombre || "Usuario",

            foto:datos.foto || ""

          };


        }


      }







      lista.push({

        id:item.id,

        eventoId:data.eventoId,

        perfil

      });



    }







    setMatches(lista);

    setCargando(false);



  }











  useEffect(()=>{


    cargarMatches();


  },[user]);









  if(cargando){


    return(

      <div className="
        text-white
        text-center
        p-6
      ">

        Cargando matches...

      </div>

    );


  }









  return(


    <div className="
      bg-black
      text-white
      p-6
      rounded-2xl
    ">



      <h1 className="
        text-3xl
        font-bold
        text-center
        mb-6
      ">

        🎉 Mis Matches

      </h1>








      {
        matches.length === 0 ? (


          <p className="
            text-gray-400
            text-center
          ">

            Todavía no tenés matches.

          </p>


        ) : (


          <div className="
            space-y-4
          ">



            {
              matches.map((match)=>(



                <div

                  key={match.id}

                  className="
                    bg-slate-900
                    border
                    border-pink-400/30
                    rounded-2xl
                    p-4
                    flex
                    items-center
                    justify-between
                  "

                >





                  <div className="
                    flex
                    items-center
                    gap-4
                  ">



                    {
                      match.perfil.foto && (


                        <img

                          src={match.perfil.foto}

                          className="
                            w-16
                            h-16
                            rounded-full
                            object-cover
                          "

                        />


                      )
                    }






                    <div>


                      <h2 className="
                        font-bold
                        text-xl
                      ">

                        {match.perfil.nombre}

                      </h2>


                      <p className="
                        text-green-400
                      ">

                        🎉 Match confirmado

                      </p>


                    </div>



                  </div>








                  <button

                    onClick={()=>router.push(`/chat/${match.id}`)}

                    className="
                      bg-blue-600
                      px-4
                      py-2
                      rounded-xl
                      font-bold
                    "

                  >

                    💬 Chat

                  </button>






                </div>


              ))

            }




          </div>


        )

      }






    </div>


  );


}