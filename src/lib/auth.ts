import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from "firebase/auth";

import { auth } from "./firebase";
import { createUserProfile } from "./users";


const provider = new GoogleAuthProvider();





export async function loginWithGoogle() {

  try {


    console.log("⏳ Iniciando Google Login...");



    const result = await signInWithPopup(

      auth,

      provider

    );



    const user = result.user;



    console.log(
      "✅ Google usuario:",
      user.uid
    );



    await createUserProfile(user);



    console.log(
      "✅ Perfil Google creado"
    );



    return user;



  } catch (error:any) {



    if(
      error.code === "auth/popup-closed-by-user"
    ){

      console.log(
        "Login cancelado"
      );


      return null;

    }



    console.error(
      "❌ Error Google:",
      error
    );



    return null;


  }

}







export async function loginAnonymous() {


  try {


    console.log(
      "⏳ Solicitando usuario anónimo..."
    );



    const result = await signInAnonymously(

      auth

    );



    const user = result.user;



    console.log(
      "✅ Usuario anónimo creado:",
      user.uid
    );



    await createUserProfile(user);



    console.log(
      "✅ Documento Firestore creado"
    );



    return user;



  } catch (error:any) {



    console.error(
      "❌ Error login anónimo:",
      error.code,
      error.message
    );



    return null;


  }

}