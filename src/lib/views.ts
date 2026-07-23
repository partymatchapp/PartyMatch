import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import { db } from "./firebase";



export async function registerView(

  eventoId: string,

  usuarioId: string,

  perfilId: string

) {


  const id = `${eventoId}_${usuarioId}_${perfilId}`;


  console.log(
    "👀 Registrando vista:",
    {
      eventoId,
      usuarioId,
      perfilId
    }
  );



  const viewRef = doc(

    db,

    "vistas",

    id

  );



  const existente = await getDoc(viewRef);





  if (existente.exists()) {


    const datos = existente.data();



    await setDoc(

      viewRef,

      {

        eventoId,

        usuarioId,

        perfilId,

        cantidadVistas:
          (datos.cantidadVistas || 0) + 1,

        ultimaVista: new Date()

      },

      {
        merge: true
      }

    );



  } else {



    await setDoc(

      viewRef,

      {

        eventoId,

        usuarioId,

        perfilId,

        cantidadVistas: 1,

        ultimaVista: new Date()

      }

    );


  }



  console.log(
    "✅ Vista guardada:",
    id
  );


}