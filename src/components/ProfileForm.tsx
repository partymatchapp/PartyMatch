"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { updateUserProfile } from "@/lib/users";


export default function ProfileForm() {

  const { user } = useUser();


  const [genero, setGenero] = useState("");
  const [busca, setBusca] = useState("");
  const [intereses, setIntereses] = useState<string[]>([]);

  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);



  const opcionesIntereses = [
    "Música",
    "Viajes",
    "Deportes",
    "Gastronomía"
  ];



  function cambiarInteres(interes: string) {

    if (intereses.includes(interes)) {

      setIntereses(
        intereses.filter((item) => item !== interes)
      );

    } else {

      setIntereses([
        ...intereses,
        interes
      ]);

    }

  }




  async function handleSave() {


    if (!user || !genero || !busca) {

      return;

    }



    setGuardando(true);



    try {


      await updateUserProfile(

        user.uid,

        {

          nombre: user.displayName || "Usuario",

          edad: "18",

          foto: user.photoURL || "",

          genero,

          busca,

          intereses,

        }

      );



      setGuardado(true);



    } catch (error) {


      console.error(
        "Error guardando perfil:",
        error
      );


    } finally {


      setGuardando(false);


    }


  }





  if (guardado) {


    return (

      <div className="
        w-full
        max-w-md
        bg-white
        rounded-3xl
        shadow-2xl
        p-8
        text-center
      ">


        <div className="text-5xl">
          🎉
        </div>


        <h1 className="
          text-2xl
          font-bold
          text-gray-800
          mt-4
        ">
          Perfil guardado
        </h1>


        <p className="
          text-gray-500
          mt-2
        ">
          Ya estás listo para encontrar coincidencias.
        </p>


      </div>

    );

  }






  return (

    <div className="
      w-full
      max-w-md
      bg-white
      rounded-3xl
      shadow-2xl
      p-8
    ">


      <div className="text-center">


        <img

          src={user?.photoURL || "/avatar.png"}

          alt="foto"

          className="
            w-24
            h-24
            rounded-full
            mx-auto
            mb-4
            object-cover
          "

        />



        <h1 className="
          text-2xl
          font-bold
          text-gray-800
        ">
          Hola {user?.displayName || "Usuario"} 👋
        </h1>



        <p className="text-gray-500 mt-2">
          Completá tu perfil para participar
        </p>


      </div>






      <label className="
        block
        mt-8
        mb-2
        font-semibold
        text-gray-700
      ">
        Soy:
      </label>



      <select

        value={genero}

        onChange={(e)=>setGenero(e.target.value)}

        className="
          w-full
          border
          rounded-xl
          p-3
          bg-black
          text-white
        "

      >

        <option value="">
          Elegir
        </option>

        <option value="hombre">
          Hombre
        </option>

        <option value="mujer">
          Mujer
        </option>


      </select>







      <label className="
        block
        mt-5
        mb-2
        font-semibold
        text-gray-700
      ">
        Busco:
      </label>



      <select

        value={busca}

        onChange={(e)=>setBusca(e.target.value)}

        className="
          w-full
          border
          rounded-xl
          p-3
          bg-black
          text-white
        "

      >


        <option value="">
          Elegir
        </option>


        <option value="hombre">
          Hombre
        </option>


        <option value="mujer">
          Mujer
        </option>


        <option value="todos">
          Todos
        </option>


      </select>







      <label className="
        block
        mt-5
        mb-2
        font-semibold
        text-gray-700
      ">
        Intereses:
      </label>





      <div className="grid grid-cols-2 gap-3">


        {opcionesIntereses.map((interes)=>(

          <button

            key={interes}

            onClick={()=>cambiarInteres(interes)}

            className={`

              rounded-xl

              py-2

              font-semibold

              ${
                intereses.includes(interes)

                ? "bg-purple-600 text-white"

                : "bg-black text-white"

              }

            `}

          >

            {interes}

          </button>


        ))}


      </div>






      <button

        onClick={handleSave}

        disabled={guardando}

        className="
          w-full
          mt-6
          bg-gradient-to-r
          from-purple-600
          to-pink-500
          text-white
          py-3
          rounded-xl
          font-semibold
          shadow-lg
        "

      >

        {
          guardando
          ? "Guardando..."
          : "Guardar perfil"
        }


      </button>


    </div>

  );

}