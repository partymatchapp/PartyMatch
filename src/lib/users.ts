import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from "firebase/firestore";

import { db } from "./firebase";



export async function createUserProfile(user: any) {

  const userRef = doc(db, "usuarios", user.uid);

  const userSnapshot = await getDoc(userRef);


  if (!userSnapshot.exists()) {

    await setDoc(userRef, {

      nombre: user.displayName,
      email: user.email,
      foto: user.photoURL,
      creadoEn: new Date(),
      perfilCompleto: false,

    });

    console.log("✅ Usuario creado en Firestore");

  } else {

    console.log("👤 Usuario ya existe");

  }

}




export async function updateUserProfile(
  uid: string,
  data: {
    genero: string;
  }
) {

  const userRef = doc(db, "usuarios", uid);


  await updateDoc(userRef, {

    genero: data.genero,
    perfilCompleto: true,
    actualizadoEn: new Date(),

  });


  console.log("✅ Perfil actualizado");

}




export async function getUserProfile(uid: string) {

  const userRef = doc(db, "usuarios", uid);

  const userSnapshot = await getDoc(userRef);


  if (userSnapshot.exists()) {

    return userSnapshot.data();

  }


  return null;

}





export async function joinEvent(
  uid: string,
  eventoId: string
) {

  const userRef = doc(db, "usuarios", uid);


  await updateDoc(userRef, {

    eventoId: eventoId,
    unidoEn: new Date(),

  });


  console.log("🎉 Usuario unido al evento:", eventoId);

}