import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

import { db } from "./firebase";





export async function createEvent(
  nombre:string,
  fecha:string,
  userId:string
) {


  const eventosRef = collection(
    db,
    "eventos"
  );


  const nuevoEvento = await addDoc(
    eventosRef,
    {

      nombre,

      fecha,

      activo:true,

      creadoPor:userId,

      creadoEn:new Date(),

    }
  );


  console.log(
    "🎉 Evento creado:",
    nuevoEvento.id
  );


  return nuevoEvento.id;


}








export async function getEvent(
  eventId:string
) {


  try {


    console.log(
      "🔎 Buscando evento:",
      eventId
    );



    if(!eventId){


      console.error(
        "❌ Evento vacío"
      );


      return null;


    }




    const eventoRef = doc(
      db,
      "eventos",
      eventId
    );



    const snapshot = await getDoc(
      eventoRef
    );



    console.log(
      "📄 Evento existe:",
      snapshot.exists()
    );



    if(snapshot.exists()){


      return {


        id:snapshot.id,


        ...snapshot.data()


      };


    }



    return null;



  }catch(error){


    console.error(
      "❌ Error obteniendo evento:",
      error
    );


    throw error;


  }


}










export async function getEventUsers(
  eventId:string
){



  try{


    console.log(
      "👥 Buscando usuarios del evento:",
      eventId
    );



    const usuariosRef = collection(
      db,
      "usuarios"
    );



    const usuariosQuery = query(

      usuariosRef,

      where(
        "eventoId",
        "==",
        eventId
      )

    );



    const snapshot = await getDocs(
      usuariosQuery
    );



    const usuarios = snapshot.docs.map(
      (item)=>({

        id:item.id,

        ...item.data()

      })
    );



    console.log(
      "👥 Usuarios encontrados:",
      usuarios.length,
      usuarios
    );



    return usuarios;



  }catch(error){


    console.error(
      "❌ Error buscando participantes:",
      error
    );


    throw error;


  }



}










export async function getMyEvents(
  userId:string
){


  const eventosRef = collection(
    db,
    "eventos"
  );



  const q = query(

    eventosRef,

    where(
      "creadoPor",
      "==",
      userId
    ),

    orderBy(
      "creadoEn",
      "desc"
    )

  );



  const snapshot = await getDocs(q);



  return snapshot.docs.map(
    (item)=>({


      id:item.id,


      ...item.data()


    })
  );



}










export async function deleteEvent(
  eventId:string
){


  await deleteDoc(

    doc(
      db,
      "eventos",
      eventId
    )

  );


}










export async function updateEvent(

  eventId:string,

  nombre:string,

  fecha:string

){


  await updateDoc(

    doc(
      db,
      "eventos",
      eventId
    ),

    {

      nombre,

      fecha

    }

  );


}









export async function getEventMatches(
  eventId:string
){


  try{


    console.log(
      "❤️ Buscando matches del evento:",
      eventId
    );



    const matchesRef = collection(
      db,
      "matches"
    );



    const matchesQuery = query(

      matchesRef,

      where(
        "eventoId",
        "==",
        eventId
      )

    );



    const snapshot = await getDocs(
      matchesQuery
    );



    const matches = snapshot.docs.map(
      (item)=>({


        id:item.id,


        ...item.data()


      })
    );



    console.log(
      "❤️ Matches encontrados:",
      matches.length,
      matches
    );



    return matches;



  }catch(error){


    console.error(
      "❌ Error buscando matches:",
      error
    );


    throw error;


  }


}









// 🗑️ Sacar participante solamente de este evento
export async function removeUserFromEvent(
  usuarioId:string
){

  try{


    const usuarioRef = doc(
      db,
      "usuarios",
      usuarioId
    );


    await updateDoc(
      usuarioRef,
      {

        eventoId:null

      }
    );


    console.log(
      "👤 Participante eliminado del evento:",
      usuarioId
    );


  }catch(error){


    console.error(
      "❌ Error eliminando participante del evento:",
      error
    );


    throw error;


  }


}