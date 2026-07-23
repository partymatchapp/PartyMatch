"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";



type Notificacion = {

  id:string;

  usuarioOrigen:string;

  eventoId:string;

  mensaje:string;

  tipo:"me_gusta" | "match";

  leido:boolean;

  creadoEn:any;

};





export default function Notifications(){



  const { user } = useUser();

  const router = useRouter();



  const [notificaciones,setNotificaciones] = useState<Notificacion[]>([]);

  const [cargando,setCargando] = useState(true);







  async function cargarNotificaciones(){



    if(!user){

      return;

    }



    const q = query(

      collection(

        db,

        "notificaciones"

      ),

      where(

        "usuarioDestino",

        "==",

        user.uid

      ),

      orderBy(

        "creadoEn",

        "desc"

      )

    );





    const snapshot = await getDocs(q);





    const lista:Notificacion[] = [];





    snapshot.forEach((item)=>{

  const data = item.data() as Notificacion;


  lista.push({

    ...data,

    id:item.id

  });


});





    setNotificaciones(lista);

    setCargando(false);


  }









  useEffect(()=>{


    cargarNotificaciones();


  },[user]);









  if(cargando){


    return(

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        Cargando notificaciones...

      </div>

    );

  }









  return(

    <div className="
      min-h-screen
      bg-black
      text-white
      p-6
      max-w-md
      mx-auto
    ">



      <h1 className="
        text-3xl
        font-bold
        mb-6
        text-center
      ">

        🔔 Notificaciones

      </h1>






      {
        notificaciones.length === 0 ? (

          <p className="
            text-gray-400
            text-center
          ">

            No tenés notificaciones todavía.

          </p>


        ) : (


          <div className="
            space-y-4
          ">



            {
              notificaciones.map((item)=>(


                <button

                  key={item.id}

                  onClick={()=>{

                    router.push(

                      `/perfil/${item.usuarioOrigen}?evento=${item.eventoId}`

                    );


                  }}

                  className="
                    w-full
                    text-left
                    bg-slate-900
                    border
                    border-blue-400/30
                    rounded-2xl
                    p-4
                  "

                >


                  <p className="
                    text-white
                    text-lg
                  ">


                    {
                      item.tipo === "match"

                      ? "🎉 "

                      : "❤️ "
                    }


                    {item.mensaje}


                  </p>



                </button>


              ))

            }



          </div>


        )

      }





    </div>


  );


}