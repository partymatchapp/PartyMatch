"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  query,
  where,
  doc,
  getDoc,
  onSnapshot
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";



type Perfil = {

  nombre:string;

  foto:string;

};





export default function Chats(){



  const { user } = useUser();

  const router = useRouter();



  const [chats,setChats] = useState<any[]>([]);

  const [cargando,setCargando] = useState(true);









  useEffect(()=>{


    if(!user){

      return;

    }







    const matchesQuery = query(

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







    const cancelar = onSnapshot(

      matchesQuery,

      async(snapshot)=>{



        const lista:any[] = [];







        for(const item of snapshot.docs){



          const data:any = item.data();



          const otroUsuario = data.usuarios.find(

            (id:string)=>id !== user.uid

          );





          let perfil:Perfil = {

            nombre:"Usuario",

            foto:""

          };







          if(otroUsuario){



            const usuarioSnap = await getDoc(

              doc(

                db,

                "usuarios",

                otroUsuario

              )

            );



            if(usuarioSnap.exists()){



              const datos = usuarioSnap.data();



              perfil = {

                nombre:datos.nombre || "Usuario",

                foto:datos.foto || ""

              };


            }


          }








          const chatSnap = await getDoc(

            doc(

              db,

              "chats",

              item.id

            )

          );








          let ultimoMensaje = "";

          let hora = "";

          let noLeidos = 0;









          if(chatSnap.exists()){



            const chat:any = chatSnap.data();



            ultimoMensaje = chat.ultimoMensaje || "";





            noLeidos =

              chat.noLeidos?.[user.uid] || 0;







            if(chat.ultimaFecha?.toDate){



              hora = chat.ultimaFecha

                .toDate()

                .toLocaleTimeString(

                  [],

                  {

                    hour:"2-digit",

                    minute:"2-digit"

                  }

                );


            }


          }








          lista.push({

            id:item.id,

            perfil,

            ultimoMensaje,

            hora,

            noLeidos

          });



        }







        setChats(lista);

        setCargando(false);



      }

    );







    return ()=>cancelar();



  },[user]);









  if(cargando){


    return(

      <div className="
        text-white
        text-center
        p-6
      ">

        Cargando chats...

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

        💬 Mis Chats

      </h1>







      {
        chats.length === 0 ? (


          <p className="
            text-gray-400
            text-center
          ">

            No tenés chats todavía.

          </p>


        ) : (


          <div className="
            space-y-4
          ">



            {
              chats.map((chat)=>(



                <button

                  key={chat.id}

                  onClick={()=>router.push(`/chat/${chat.id}`)}

                  className="
                    w-full
                    bg-slate-900
                    border
                    border-green-400/30
                    rounded-2xl
                    p-4
                    flex
                    items-center
                    gap-4
                    text-left
                  "

                >




                  {
                    chat.perfil.foto && (

                      <img

                        src={chat.perfil.foto}

                        className="
                          w-16
                          h-16
                          rounded-full
                          object-cover
                        "

                      />

                    )
                  }







                  <div className="
                    flex-1
                  ">


                    <h2 className="
                      text-xl
                      font-bold
                    ">

                      {chat.perfil.nombre}


                      {
                        chat.noLeidos > 0 && (

                          <span className="
                            ml-2
                            bg-red-500
                            text-white
                            rounded-full
                            px-2
                            text-sm
                          ">

                            {chat.noLeidos}

                          </span>

                        )
                      }


                    </h2>





                    <p className="
                      text-gray-300
                      truncate
                    ">

                      {
                        chat.ultimoMensaje ||

                        "Todavía no hay mensajes"

                      }

                    </p>



                  </div>






                  <span className="
                    text-xs
                    text-gray-400
                  ">

                    {chat.hora}

                  </span>






                </button>


              ))

            }



          </div>


        )

      }






    </div>


  );


}