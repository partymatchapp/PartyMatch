import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  updateDoc
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

  return resultado.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getMyEvents(userId: string) {
  const eventosRef = collection(db, "eventos");

  const q = query(
    eventosRef,
    where("creadoPor", "==", userId),
    orderBy("creadoEn", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function deleteEvent(eventId: string) {
  await deleteDoc(
    doc(db, "eventos", eventId)
  );
}

export async function updateEvent(
  eventId: string,
  nombre: string,
  fecha: string
) {
  await updateDoc(
    doc(db, "eventos", eventId),
    {
      nombre,
      fecha,
    }
  );
}