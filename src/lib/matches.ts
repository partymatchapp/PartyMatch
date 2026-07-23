import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "./firebase";





export async function checkExistingMatch(

  eventoId:string,

  usuario1:string,

  usuario2:string

):Promise<string | null>{



  const usuarios = [

    usuario1,

    usuario2

  ].sort();





  const ref = collection(

    db,

    "matches"

  );





  const q = query(

    ref,

    where(

      "eventoId",

      "==",

      eventoId

    ),

    where(

      "usuarios",

      "==",

      usuarios

    )

  );





  const snapshot = await getDocs(q);





  if(snapshot.empty){


    return null;


  }





  return snapshot.docs[0].id;


}