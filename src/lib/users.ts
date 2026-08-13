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

  fotos?: string[];

  genero?: string;

  busca?: string;

  intereses?: string[];

  eventoId?: string | null;

  perfilCompleto?: boolean;

}





// ======================================================
// CREAR PERFIL DE USUARIO
// ======================================================

export async function createUserProfile(
  user: any
) {

  try {

    const userRef = doc(
      db,
      "usuarios",
      user.uid
    );

    const snapshot = await getDoc(
      userRef
    );

    if (!snapshot.exists()) {

      await setDoc(

        userRef,

        {

          nombre: user.displayName || "",

          email: user.email || "",

          foto: user.photoURL || "",

          fotos: [],

          edad: "",

          genero: "",

          busca: "",

          intereses: [],

          perfilCompleto: false,

          eventoId: null,

          creadoEn: new Date(),

        }

      );

      console.log(
        "✅ Usuario creado"
      );

    }

  } catch (error: any) {

    console.error(
      "❌ Error creando usuario:",
      error
    );

    throw error;

  }

}





// ======================================================
// ACTUALIZAR PERFIL
// ======================================================

export async function updateUserProfile(

  uid: string,

  data: {

    nombre: string;

    edad: string;

    foto: string;

    fotos?: string[];

    genero: string;

    busca: string;

    intereses: string[];

  }

) {

  try {

    if (!data.foto) {

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

        nombre: data.nombre,

        edad: data.edad,

        foto: data.foto,

        fotos: data.fotos || [],

        genero: data.genero,

        busca: data.busca,

        intereses: data.intereses,

        perfilCompleto: true,

        actualizadoEn: new Date(),

      },

      {

        merge: true

      }

    );

    console.log(
      "✅ Perfil actualizado"
    );

  } catch (error: any) {

    console.error(
      "❌ Error actualizando perfil:",
      error
    );

    throw error;

  }

}





// ======================================================
// OBTENER PERFIL
// ======================================================

export async function getUserProfile(

  uid: string

): Promise<UserProfile | null> {

  try {

    const userRef = doc(
      db,
      "usuarios",
      uid
    );

    const snapshot = await getDoc(
      userRef
    );

    if (snapshot.exists()) {

      return {

        id: snapshot.id,

        ...snapshot.data()

      } as UserProfile;

    }

    return null;

  } catch (error) {

    console.error(
      "❌ Error obteniendo perfil:",
      error
    );

    return null;

  }

}





// ======================================================
// UNIR USUARIO A UN EVENTO
//
// IMPORTANTE:
// Esta función NO debe ejecutarse automáticamente
// desde la página del evento.
//
// Se utiliza solamente cuando realmente queremos
// incorporar al usuario al evento.
// ======================================================

export async function joinEvent(

  uid: string,

  eventoId: string

) {

  try {

    if (!uid) {

      throw new Error(
        "UID de usuario vacío"
      );

    }

    if (!eventoId) {

      throw new Error(
        "ID de evento vacío"
      );

    }

    const userRef = doc(
      db,
      "usuarios",
      uid
    );

    const snapshot = await getDoc(
      userRef
    );

    if (!snapshot.exists()) {

      throw new Error(
        "El usuario no existe"
      );

    }

    await setDoc(

      userRef,

      {

        eventoId: eventoId,

        unidoEn: new Date()

      },

      {

        merge: true

      }

    );

    console.log(
      "🎉 Usuario unido al evento:",
      eventoId
    );

    return true;

  } catch (error) {

    console.error(
      "❌ Error uniéndose al evento:",
      error
    );

    throw error;

  }

}