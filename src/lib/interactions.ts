import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import { db } from "./firebase";
import { createNotification } from "./notifications";
import { createChat } from "./chat";



export async function saveInteraction(

  eventoId:string,

  usuarioId:string,

  perfilId:string,

  estado:"interesado" | "no_interesa"

):Promise<boolean>{



  const id = `${eventoId}_${usuarioId}_${perfilId}`;



  await setDoc(

    doc(
      db,
      "interacciones",
      id
    ),

    {

      eventoId,

      usuarioId,

      perfilId,

      estado,

      actualizadoEn:new Date()

    },

    {

      merge:true

    }

  );



  console.log(
    "✅ Interacción guardada:",
    estado
  );





  if(estado !== "interesado"){

    return false;

  }







  const usuarioOrigen = await getUserData(

    usuarioId

  );



  const nombreUsuario = usuarioOrigen.nombre;






  await createNotification(

    perfilId,

    usuarioId,

    eventoId,

    "me_gusta",

    `${nombreUsuario} está interesado en vos ❤️`,

    usuarioOrigen.nombre,

    usuarioOrigen.foto

  );







  const esMatch = await checkMatch(

    eventoId,

    usuarioId,

    perfilId

  );





  if(!esMatch){

    return false;

  }








  await createMatch(

    eventoId,

    usuarioId,

    perfilId

  );





  await createChat(

    eventoId,

    usuarioId,

    perfilId

  );








  const usuarioDestino = await getUserData(

    perfilId

  );



  const nombrePerfil = usuarioDestino.nombre;







  await createNotification(

    usuarioId,

    perfilId,

    eventoId,

    "match",

    `🎉 ¡Hiciste Match con ${nombrePerfil}!`,

    usuarioDestino.nombre,

    usuarioDestino.foto

  );







  await createNotification(

    perfilId,

    usuarioId,

    eventoId,

    "match",

    `🎉 ¡Hiciste Match con ${nombreUsuario}!`,

    usuarioOrigen.nombre,

    usuarioOrigen.foto

  );







  return true;


}









export async function checkMatch(

  eventoId:string,

  usuarioId:string,

  perfilId:string

):Promise<boolean>{



  const q = query(

    collection(

      db,

      "interacciones"

    ),

    where(

      "eventoId",

      "==",

      eventoId

    ),

    where(

      "usuarioId",

      "==",

      perfilId

    ),

    where(

      "perfilId",

      "==",

      usuarioId

    ),

    where(

      "estado",

      "==",

      "interesado"

    )

  );





  const snapshot = await getDocs(q);



  return !snapshot.empty;


}









export async function createMatch(

  eventoId:string,

  usuario1:string,

  usuario2:string

){



  const usuarios = [

    usuario1,

    usuario2

  ].sort();





  const id =

    `${eventoId}_${usuarios[0]}_${usuarios[1]}`;







  await setDoc(

    doc(

      db,

      "matches",

      id

    ),

    {

      eventoId,

      usuarios,

      creadoEn:new Date()

    },

    {

      merge:true

    }

  );



  console.log(

    "🎉 MATCH creado",

    id

  );


}









async function getUserData(

  usuarioId:string

):Promise<{

  nombre:string;

  foto:string;

}>{



  const snap = await getDoc(

    doc(

      db,

      "usuarios",

      usuarioId

    )

  );



  if(!snap.exists()){


    return {

      nombre:"Alguien",

      foto:""

    };


  }



  const data = snap.data();



  return {

    nombre:data.nombre || "Alguien",

    foto:data.foto || ""

  };


}









export async function getDiscoveryUsers(

  eventoId:string,

  usuarioId:string,

  busca:string

){



  const usuariosQuery = query(

    collection(

      db,

      "usuarios"

    ),

    where(

      "eventoId",

      "==",

      eventoId

    )

  );





  const usuariosSnapshot = await getDocs(

    usuariosQuery

  );





  const vistasQuery = query(

    collection(

      db,

      "vistas"

    ),

    where(

      "eventoId",

      "==",

      eventoId

    ),

    where(

      "usuarioId",

      "==",

      usuarioId

    )

  );





  const vistasSnapshot = await getDocs(

    vistasQuery

  );





  const vistas:any = {};





  vistasSnapshot.forEach((item)=>{


    const data = item.data();

    vistas[data.perfilId] = data;


  });







  const usuarios:any[] = [];







  usuariosSnapshot.forEach((item)=>{



    const data = item.data();





    if(item.id === usuarioId){

      return;

    }





    if(

      busca !== "todos" &&

      data.genero !== busca

    ){

      return;

    }





    const vista = vistas[item.id];





    if(vista){



      const cantidad = vista.cantidadVistas || 0;



      const ultima = vista.ultimaVista?.toDate

        ? vista.ultimaVista.toDate()

        : null;





      if(

        cantidad >= 10 &&

        ultima

      ){



        const minutos =

          (

            Date.now()

            -

            ultima.getTime()

          )

          /

          1000

          /

          60;





        if(minutos < 10){

          return;

        }


      }


    }







    usuarios.push({

      id:item.id,

      ...data

    });



  });







  return usuarios;


}