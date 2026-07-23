"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";

import {
  getDiscoveryUsers,
  saveInteraction
} from "@/lib/interactions";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { registerView } from "@/lib/views";

import {
  createChat
} from "@/lib/chat";

import PersonCard from "./PersonCard";
import MatchModal from "./MatchModal";



export default function Discovery({

  eventoId

}:{

  eventoId:string

}) {



  const { user } = useUser();

  const router = useRouter();



  const [usuarios,setUsuarios] = useState<any[]>([]);

  const [indice,setIndice] = useState(0);

  const [cargando,setCargando] = useState(true);

  const [busca,setBusca] = useState("todos");



  const [mostrarMatch,setMostrarMatch] = useState(false);

  const [personaMatch,setPersonaMatch] = useState<any>(null);









  async function cargarUsuarios(){



    if(!user){

      return;

    }





    const usuarioRef = doc(

      db,

      "usuarios",

      user.uid

    );





    const usuarioSnap = await getDoc(usuarioRef);





    let preferencia="todos";





    if(usuarioSnap.exists()){



      const datos = usuarioSnap.data();



      if(datos.busca){

        preferencia = datos.busca;

      }


    }





    setBusca(preferencia);





    const resultado = await getDiscoveryUsers(

      eventoId,

      user.uid,

      preferencia

    );





    setUsuarios(resultado);







    for(const usuario of resultado){



      await registerView(

        eventoId,

        user.uid,

        usuario.id

      );


    }





    setCargando(false);



  }









  useEffect(()=>{


    cargarUsuarios();



  },[user,eventoId]);









  async function reaccionar(

    perfilId:string,

    estado:"interesado"|"no_interesa"

  ){



    if(!user){

      return;

    }







    const huboMatch = await saveInteraction(

      eventoId,

      user.uid,

      perfilId,

      estado

    );








    if(huboMatch){



      const persona = usuarios[indice];



      setPersonaMatch(persona);



      setMostrarMatch(true);



    }







    setIndice(

      anterior=>anterior+1

    );



  }









  async function enviarMensaje(){



    if(

      !user ||

      !personaMatch

    ){

      return;

    }







    const chatId = await createChat(

      eventoId,

      user.uid,

      personaMatch.id

    );







    router.push(

      `/chat/${chatId}`

    );



  }









  if(cargando){



    return(



      <div className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        text-white
      ">


        Cargando personas...


      </div>


    );


  }









  const personaActual = usuarios[indice];









  return(



    <main className="
      min-h-screen
      bg-black
      px-4
      py-6
    ">



      <div className="
        max-w-md
        mx-auto
      ">





        <h1 className="
          text-white
          text-3xl
          font-bold
          text-center
          mb-6
        ">


          PartyMatch


        </h1>








        {

          personaActual ? (



            <PersonCard



              persona={personaActual}



              onLike={()=>reaccionar(


                personaActual.id,


                "interesado"


              )}





              onDislike={()=>reaccionar(


                personaActual.id,


                "no_interesa"


              )}





            />



          ):(




            <div className="
              text-gray-400
              text-center
              mt-20
            ">


              No hay más personas disponibles.


            </div>




          )


        }







      </div>









      <MatchModal



        abierto={mostrarMatch}



        nombre={personaMatch?.nombre || ""}



        foto={personaMatch?.foto || ""}



        onCerrar={()=>setMostrarMatch(false)}



        onEnviarMensaje={enviarMensaje}



      />







    </main>



  );


}