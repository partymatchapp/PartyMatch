"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "@/lib/firebase";



export default function AdminLoginPage(){


  const router = useRouter();


  const [email,setEmail] =
    useState("");

  const [password,setPassword] =
    useState("");


  const [cargando,setCargando] =
    useState(false);




  async function ingresar(){


    try{


      setCargando(true);


      await signInWithEmailAndPassword(

        auth,

        email,

        password

      );


      router.push(
        "/admin"
      );


    }catch(error){


      console.error(error);


      alert(
        "Usuario o contraseña incorrectos"
      );


    }finally{


      setCargando(false);


    }


  }





  return(


    <main className="
      min-h-screen
      bg-slate-900
      flex
      items-center
      justify-center
      p-6
    ">


      <div className="
        bg-white
        rounded-3xl
        p-8
        w-full
        max-w-md
      ">


        <h1 className="
          text-3xl
          font-bold
          text-center
          mb-6
          text-black
        ">

          🎉 Admin PartyMatch

        </h1>



        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

          className="
            w-full
            border
            rounded-xl
            p-3
            mb-4
            text-black
          "

        />



        <input

          type="password"

          placeholder="Contraseña"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

          className="
            w-full
            border
            rounded-xl
            p-3
            mb-6
            text-black
          "

        />




        <button

          onClick={ingresar}

          disabled={cargando}

          className="
            w-full
            bg-blue-600
            text-white
            rounded-xl
            py-3
            font-bold
          "

        >

          {
            cargando
            ?
            "Ingresando..."
            :
            "Ingresar"
          }


        </button>



      </div>


    </main>


  );


}