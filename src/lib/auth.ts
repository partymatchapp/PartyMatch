import {
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "./firebase";
import { createUserProfile } from "./users";

const provider = new GoogleAuthProvider();


// ======================================================
// LOGIN CON USUARIO + CONTRASEÑA
// ======================================================

export async function loginWithUsername(
  username: string,
  password: string
) {
  try {
    console.log("⏳ Iniciando login:", username);

    const email = `${username.toLowerCase().trim()}@partymatch.app`;

    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = result.user;

    console.log(
      "✅ Login correcto:",
      user.uid
    );

    return user;

  } catch (error: any) {

    console.error(
      "❌ Error login:",
      error.code,
      error.message
    );

    return null;
  }
}


// ======================================================
// LOGIN CON GOOGLE
// ======================================================

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

  } catch (error: any) {

    if (
      error.code === "auth/popup-closed-by-user"
    ) {

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


// ======================================================
// CREAR CUENTA EMAIL/PASSWORD
// ======================================================
//
// Esta función se utilizará para nuevos usuarios.
// Los usuarios que ya fueron migrados NO necesitan
// utilizarla: ingresan directamente con loginWithUsername().
// ======================================================

export async function createEmailPasswordUser(
  username: string,
  password: string
) {

  try {

    const email =
      `${username.toLowerCase().trim()}@partymatch.app`;

    console.log(
      "⏳ Creando usuario:",
      username
    );

    // Importante:
    // esta función crea una cuenta nueva.
    // NO debe utilizarse para los 56 usuarios migrados.

    const credential =
      EmailAuthProvider.credential(
        email,
        password
      );

    const currentUser = auth.currentUser;

    if (!currentUser) {

      throw new Error(
        "No hay usuario autenticado para crear la cuenta."
      );
    }

    const result =
      await linkWithCredential(
        currentUser,
        credential
      );

    const user = result.user;

    console.log(
      "✅ Cuenta Email/Password creada:",
      user.uid
    );

    await createUserProfile(user);

    return user;

  } catch (error: any) {

    console.error(
      "❌ Error creando cuenta:",
      error.code,
      error.message
    );

    throw error;
  }
}