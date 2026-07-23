import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "./firebase";



type TipoNotificacion =
  | "me_gusta"
  | "match";








export async function createNotification(

  usuarioDestino:string,

  usuarioOrigen:string,

  eventoId:string,

  tipo:TipoNotificacion,

  mensaje:string,

  nombreOrigen:string,

  fotoOrigen:string

):Promise<void>{



  const id =

    `${usuarioDestino}_${usuarioOrigen}_${eventoId}_${tipo}`;



  const notificationRef = doc(

    db,

    "notificaciones",

    id

  );





  await setDoc(

    notificationRef,

    {

      usuarioDestino,

      usuarioOrigen,

      eventoId,

      tipo,

      mensaje,

      nombreOrigen,

      fotoOrigen,

      leido:false,

      creadoEn:serverTimestamp()

    },

    {

      merge:true

    }

  );



  console.log(

    "🔔 Notificación creada:",

    mensaje

  );


}









export async function getUnreadNotificationsCount(

  usuarioId:string

):Promise<number>{



  const ref = collection(

    db,

    "notificaciones"

  );



  const q = query(

    ref,

    where(

      "usuarioDestino",

      "==",

      usuarioId

    ),

    where(

      "leido",

      "==",

      false

    )

  );



  const snapshot = await getDocs(q);



  return snapshot.size;


}









export async function markNotificationsAsRead(

  usuarioId:string

):Promise<void>{



  const ref = collection(

    db,

    "notificaciones"

  );



  const q = query(

    ref,

    where(

      "usuarioDestino",

      "==",

      usuarioId

    ),

    where(

      "leido",

      "==",

      false

    )

  );



  const snapshot = await getDocs(q);




  const actualizaciones = snapshot.docs.map(

    (item)=>

      setDoc(

        item.ref,

        {

          leido:true

        },

        {

          merge:true

        }

      )

  );




  await Promise.all(

    actualizaciones

  );



  console.log(

    "🔔 Notificaciones marcadas como leídas"

  );


}