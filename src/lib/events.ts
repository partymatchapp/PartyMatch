import { 
  collection, 
  addDoc, 
  doc, 
  getDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { db } from "./firebase";



export async function createEvent(
  nombre: string,
  fecha: string,
  userId: string
) {

  const eventosRef = collection(db, "eventos");


  const nuevoEvento = await addDoc(eventosRef, {

    nombre,
    fecha,
    activo: true,
    creadoPor: userId,
    creadoEn: new Date(),

  });


  console.log("🎉 Evento creado:", nuevoEvento.id);


  return nuevoEvento.id;

}





export async function getEvent(eventId: string) {

  const eventoRef = doc(db, "eventos", eventId);


  const eventoSnapshot = await getDoc(eventoRef);


  if (eventoSnapshot.exists()) {

    return {
      id: eventoSnapshot.id,
      ...eventoSnapshot.data(),
    };

  }


  return null;

}





export async function getEventUsers(eventId: string) {

  const usuariosRef = collection(db, "usuarios");


  const usuariosQuery = query(
    usuariosRef,
    where("eventoId", "==", eventId)
  );


  const resultado = await getDocs(usuariosQuery);


  const usuarios = resultado.docs.map((doc) => ({

    id: doc.id,
    ...doc.data(),

  }));


  console.log(
    "👥 Usuarios del evento:",
    usuarios.length
  );


  return usuarios;

}