import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "./users";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    await createUserProfile(user);

    return user;

  } catch (error: any) {

    if (error.code === "auth/popup-closed-by-user") {
      console.log("Login cancelado por el usuario");
      return null;
    }

    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}