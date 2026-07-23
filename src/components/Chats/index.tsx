"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";



type Perfil = {

  id:string;

  nombre:string;

  foto:string;

};





export default function Chats({

  onUnreadChange

}:{

  onUnreadChange:(cantidad:number)=>void;

}){


  const { user } = useUser();

  const router = useRouter();


  const [chats,setChats] =
    useState<any[]>([]);


  const [cargando,setCargando] =
    useState(true);





  useEffect(()=>{


    if(!user){

      return;

    }





    const chatsQuery = query(

      collection(
        db,
        "chats"
      ),

      where(
        "usuarios",
        "array-contains",
        user.uid
      )

    );







    const cancelar = onSnapshot(

      chatsQuery,

      async(snapshot)=>{


        const lista:any[] = [];





        for(const item of snapshot.docs){



          const data:any =
            item.data();




          const otroUsuario =
            data.usuarios.find(
              (id:string)=>id !== user.uid
            );





          if(!otroUsuario){

            continue;

          }





          let perfil:Perfil = {

            id:otroUsuario,

            nombre:"Usuario",

            foto:""

          };





          const usuarioSnap =
            await getDoc(

              doc(
                db,
                "usuarios",
                otroUsuario
              )

            );





          if(usuarioSnap.exists()){


            const datos =
              usuarioSnap.data();



            perfil = {

              id:otroUsuario,

              nombre:
                datos.nombre ||
                "Usuario",


              foto:
                datos.foto ||
                ""

            };


          }







          lista.push({


            id:item.id,


            perfil,


            ultimoMensaje:
              data.ultimoMensaje ||
              "",



            hora:
              data.ultimaFecha?.toDate

              ?

              data.ultimaFecha
              .toDate()
              .toLocaleTimeString(
                [],
                {
                  hour:"2-digit",
                  minute:"2-digit"
                }
              )

              :

              "",





            noLeidos:
              data.noLeidos?.[user.uid] || 0



          });



        }







        setChats(lista);





        const totalNoLeidos = lista.reduce(

          (total,chat)=>{

            return total + chat.noLeidos;

          },

          0

        );





        onUnreadChange(totalNoLeidos);





        setCargando(false);



      }

    );







    return ()=>cancelar();



  },[user,onUnreadChange]);









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
        chats.length === 0 ?


        (

          <p className="
            text-gray-400
            text-center
          ">

            No tenés chats todavía.

          </p>


        )

        :


        (



        <div className="
          space-y-4
        ">



        {
          chats.map((chat)=>(



            <div

              key={chat.id}

              className="
                bg-slate-900
                border
                border-green-400/30
                rounded-2xl
                p-4
                flex
                items-center
                gap-4
              "

            >






              <button

                onClick={()=>router.push(
                  `/perfil/${chat.perfil.id}`
                )}

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


              </button>








              <button

                onClick={()=>router.push(
                  `/chat/${chat.id}`
                )}

                className="
                  flex-1
                  text-left
                "

              >



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




              </button>







              <span className="
                text-xs
                text-gray-400
              ">


                {chat.hora}


              </span>







            </div>



          ))

        }



        </div>



        )

      }





    </div>


  );


}