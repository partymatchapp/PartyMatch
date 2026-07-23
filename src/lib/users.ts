import { 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";

import { db } from "./firebase";



export interface UserProfile {

  id:string;

  nombre?:string;

  edad?:string;

  email?:string;

  foto?:string;

  genero?:string;

  busca?:string;

  intereses?:string[];

  eventoId?:string;

  perfilCompleto?:boolean;

}







export async function createUserProfile(
  user:any
){


  try{


    const userRef = doc(
      db,
      "usuarios",
      user.uid
    );


    const snapshot = await getDoc(
      userRef
    );



    if(!snapshot.exists()){


      await setDoc(

        userRef,

        {

          nombre:user.displayName || "",

          email:user.email || "",

          foto:user.photoURL || "",

          edad:"",

          genero:"",

          busca:"",

          intereses:[],

          perfilCompleto:false,

          creadoEn:new Date(),

        }

      );


      console.log(
        "✅ Usuario creado"
      );


    }


  }catch(error:any){


    console.error(
      "❌ Error creando usuario:",
      error
    );


    throw error;


  }


}









export async function updateUserProfile(

  uid:string,

  data:{

    nombre:string;

    edad:string;

    foto:string;

    genero:string;

    busca:string;

    intereses:string[];

  }

){


  try{


    if(!data.foto){


      throw new Error(
        "La foto de perfil es obligatoria"
      );


    }





    const userRef = doc(

      db,

      "usuarios",

      uid

    );





    await setDoc(

      userRef,

      {


        nombre:data.nombre,

        edad:data.edad,

        foto:data.foto,

        genero:data.genero,

        busca:data.busca,

        intereses:data.intereses,


        perfilCompleto:true,


        actualizadoEn:new Date(),


      },

      {

        merge:true

      }

    );



    console.log(
      "✅ Perfil actualizado"
    );



  }catch(error:any){


    console.error(
      "❌ Error actualizando perfil:",
      error
    );


    throw error;


  }


}









export async function getUserProfile(

  uid:string

):Promise<UserProfile|null>{


  try{


    const userRef = doc(

      db,

      "usuarios",

      uid

    );


    const snapshot = await getDoc(
      userRef
    );



    if(snapshot.exists()){


      return {


        id:snapshot.id,


        ...snapshot.data()


      } as UserProfile;


    }



    return null;



  }catch(error){


    console.error(
      "❌ Error obteniendo perfil:",
      error
    );


    return null;


  }


}









export async function joinEvent(

  uid:string,

  eventoId:string

){


  try{


    const userRef = doc(

      db,

      "usuarios",

      uid

    );



    await setDoc(

      userRef,

      {

        eventoId,

        unidoEn:new Date()

      },

      {

        merge:true

      }

    );



    console.log(
      "🎉 Usuario unido:",
      eventoId
    );



  }catch(error){


    console.error(
      "❌ Error uniéndose al evento:",
      error
    );


    throw error;


  }


}