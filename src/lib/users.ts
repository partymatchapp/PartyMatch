import { 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";

import { db } from "./firebase";



export interface UserProfile {

  id: string;

  nombre?: string;

  edad?: string;

  email?: string;

  foto?: string;

  genero?: string;

  busca?: string;

  intereses?: string[];

  eventoId?: string;

  perfilCompleto?: boolean;

}





export async function createUserProfile(
  user:any
) {


  try {


    const userRef = doc(

      db,

      "usuarios",

      user.uid

    );



    const userSnapshot = await getDoc(
      userRef
    );



    if(!userSnapshot.exists()) {


      await setDoc(

        userRef,

        {


          nombre: user.displayName || "",


          email: user.email || "",


          foto: user.photoURL || "",


          edad: "",


          genero: "",


          busca: "",


          intereses: [],


          creadoEn: new Date(),


          perfilCompleto:false,


        }

      );



      console.log(
        "✅ Usuario creado"
      );


    } else {


      console.log(
        "ℹ️ Usuario ya existe"
      );


    }



  } catch(error:any){


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



  try {



    console.log(

      "⏳ Guardando perfil:",

      uid

    );




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

):Promise<UserProfile | null>{



  try {



    const userRef = doc(

      db,

      "usuarios",

      uid

    );




    const userSnapshot = await getDoc(

      userRef

    );




    if(userSnapshot.exists()){


      return {


        id:userSnapshot.id,


        ...userSnapshot.data()


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



  try {



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