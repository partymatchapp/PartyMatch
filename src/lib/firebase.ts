import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {

  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,

};





console.log(
  "🔥 Firebase config:",
  {
    apiKey: firebaseConfig.apiKey ? "OK" : "FALTA",
    authDomain: firebaseConfig.authDomain ? "OK" : "FALTA",
    projectId: firebaseConfig.projectId ? "OK" : "FALTA",
    storageBucket: firebaseConfig.storageBucket ? "OK" : "FALTA",
    appId: firebaseConfig.appId ? "OK" : "FALTA",
  }
);





const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);


export const db = getFirestore(app);


export const storage = getStorage(app);



console.log(
  "🔥 Firebase conectado correctamente"
);



export default app;