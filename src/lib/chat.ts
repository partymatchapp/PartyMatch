import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  getDoc
} from "firebase/firestore";

import { db } from "./firebase";








export async function createChat(

  eventoId:string,

  usuario1:string,

  usuario2:string

):Promise<string>{



  const usuarios = [

    usuario1,

    usuario2

  ].sort();





  const chatId =

    `${eventoId}_${usuarios[0]}_${usuarios[1]}`;








  await setDoc(

    doc(

      db,

      "chats",

      chatId

    ),

    {

      eventoId,

      usuarios,

      creadoEn:serverTimestamp(),

      ultimoMensaje:"",

      ultimaFecha:serverTimestamp(),

      ultimoEmisor:"",

      noLeidos:{

        [usuario1]:0,

        [usuario2]:0

      }

    },

    {

      merge:true

    }

  );







  return chatId;


}









export async function sendMessage(

  chatId:string,

  usuarioId:string,

  texto:string

){



  const mensajesRef = collection(

    db,

    "chats",

    chatId,

    "mensajes"

  );








  await addDoc(

    mensajesRef,

    {

      enviadoPor:usuarioId,

      texto,

      leido:false,

      creadoEn:serverTimestamp()

    }

  );









  const chatSnap = await getDoc(

    doc(

      db,

      "chats",

      chatId

    )

  );





  if(!chatSnap.exists()){

    return;

  }







  const chat:any = chatSnap.data();



  const otroUsuario = chat.usuarios.find(

    (id:string)=>id !== usuarioId

  );





  if(!otroUsuario){

    return;

  }







  const actuales = chat.noLeidos || {};



  actuales[otroUsuario] =

    (actuales[otroUsuario] || 0) + 1;









  await updateDoc(

    doc(

      db,

      "chats",

      chatId

    ),

    {

      ultimoMensaje:texto,

      ultimaFecha:serverTimestamp(),

      ultimoEmisor:usuarioId,

      noLeidos:actuales

    }

  );



}









export function listenMessages(

  chatId:string,

  callback:(mensajes:any[])=>void

){



  const mensajesRef = collection(

    db,

    "chats",

    chatId,

    "mensajes"

  );







  const q = query(

    mensajesRef,

    orderBy(

      "creadoEn",

      "asc"

    )

  );







  return onSnapshot(

    q,

    (snapshot)=>{



      const mensajes = snapshot.docs.map((item)=>({



        id:item.id,

        ...item.data()



      }));





      callback(mensajes);



    }

  );



}









export async function markMessagesAsRead(

  chatId:string,

  usuarioId:string

){



  const chatRef = doc(

    db,

    "chats",

    chatId

  );





  await updateDoc(

    chatRef,

    {

      [`noLeidos.${usuarioId}`]:0

    }

  );








  const mensajesRef = collection(

    db,

    "chats",

    chatId,

    "mensajes"

  );







  onSnapshot(

    mensajesRef,

    async(snapshot)=>{



      for(const item of snapshot.docs){



        const data:any = item.data();



        if(

          data.enviadoPor !== usuarioId &&

          data.leido === false

        ){



          await updateDoc(

            doc(

              db,

              "chats",

              chatId,

              "mensajes",

              item.id

            ),

            {

              leido:true

            }

          );


        }



      }


    }

  );



}