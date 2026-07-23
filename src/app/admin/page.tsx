"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";

import {
  createEvent,
  getMyEvents,
  deleteEvent,
} from "@/lib/events";

import EventQR from "@/components/admin/EventQR";


type Evento = {
  id:string;
  nombre:string;
  fecha:string;
  activo?:boolean;
};



export default function AdminPage(){


  const router = useRouter();

  const { user } = useUser();


  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [loginError,setLoginError] = useState("");

  const [logueando,setLogueando] = useState(false);


  const [nombre,setNombre] = useState("");

  const [fecha,setFecha] = useState("");

  const [eventos,setEventos] =
    useState<Evento[]>([]);

  const [creando,setCreando] =
    useState(false);

  const [cargando,setCargando] =
    useState(true);





  async function ingresarAdministrador(){

    try{

      setLogueando(true);
      setLoginError("");

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


    }catch(error){

      console.error(error);

      setLoginError(
        "Email o contraseña incorrectos"
      );


    }finally{

      setLogueando(false);

    }

  }







  async function cargarEventos(){

    if(!user){
      return;
    }


    try{

      setCargando(true);


      const resultado =
        await getMyEvents(user.uid);


      setEventos(
        resultado as Evento[]
      );


    }catch(error){

      console.error(
        "Error cargando eventos:",
        error
      );


    }finally{

      setCargando(false);

    }

  }





  useEffect(()=>{

    cargarEventos();

  },[user]);







  async function cerrarSesion(){

    try{

      await signOut(auth);

      router.push("/login");


    }catch(error){

      console.error(
        "Error cerrando sesión:",
        error
      );

    }

  }






  async function handleCreate(){

    if(!user){
      return;
    }


    if(!nombre.trim()){

      alert(
        "Ingresá un nombre para el evento."
      );

      return;

    }


    if(!fecha){

      alert(
        "Seleccioná una fecha."
      );

      return;

    }



    try{

      setCreando(true);


      await createEvent(
        nombre,
        fecha,
        user.uid
      );


      setNombre("");

      setFecha("");


      await cargarEventos();


    }catch(error){

      console.error(error);


      alert(
        "No se pudo crear el evento."
      );


    }finally{

      setCreando(false);

    }

  }






  async function handleDelete(id:string){

    const confirmar =
      confirm(
        "¿Seguro que querés eliminar este evento?"
      );


    if(!confirmar){
      return;
    }


    try{

      await deleteEvent(id);

      await cargarEventos();


    }catch(error){

      console.error(error);


      alert(
        "No se pudo eliminar el evento."
      );

    }

  }
  if(!user){

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
            text-black
            text-center
            mb-6
          ">
            🎉 PartyMatch Admin
          </h1>


          <input

            value={email}

            onChange={(e)=>
              setEmail(e.target.value)
            }

            placeholder="Email administrador"

            className="
              w-full
              border
              rounded-xl
              p-4
              mb-4
              text-black
            "

          />



          <input

            type="password"

            value={password}

            onChange={(e)=>
              setPassword(e.target.value)
            }

            placeholder="Contraseña"

            className="
              w-full
              border
              rounded-xl
              p-4
              mb-4
              text-black
            "

          />



          {
            loginError && (

              <p className="
                text-red-600
                text-center
                mb-4
              ">
                {loginError}
              </p>

            )
          }



          <button

            onClick={ingresarAdministrador}

            disabled={logueando}

            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-xl
              py-4
              font-bold
            "

          >

            {
              logueando
              ? "Ingresando..."
              : "Ingresar"
            }

          </button>


        </div>


      </main>

    );

  }





  return(

    <main className="
      min-h-screen
      bg-slate-100
    ">


      <header className="
        bg-slate-900
        text-white
        shadow-lg
      ">


        <div className="
          max-w-6xl
          mx-auto
          px-6
          py-5
          flex
          justify-between
          items-center
        ">


          <div>

            <h1 className="
              text-3xl
              font-bold
            ">
              🎉 PartyMatch
            </h1>


            <p className="
              text-sm
              text-gray-300
            ">
              Panel de Administración
            </p>

          </div>



          <div className="text-right">


            <p className="font-bold">

              {
                user.displayName ||
                "Administrador"
              }

            </p>


            <p className="
              text-xs
              text-gray-400
              mb-3
            ">
              {user.email}
            </p>



            <button

              onClick={cerrarSesion}

              className="
                bg-red-600
                hover:bg-red-700
                px-4
                py-2
                rounded-xl
                text-sm
                font-bold
              "

            >
              🚪 Salir

            </button>


          </div>


        </div>


      </header>





      <div className="
        max-w-6xl
        mx-auto
        p-6
      ">



        <div className="
          bg-white
          rounded-2xl
          shadow-lg
          p-8
          mb-8
        ">


          <h2 className="
            text-2xl
            font-bold
            text-black
            mb-6
          ">
            Mis eventos
          </h2>



          {
            cargando ? (

              <p className="text-gray-500">
                Cargando eventos...
              </p>


            ) : eventos.length === 0 ? (

              <p className="text-gray-500">
                Todavía no tenés eventos creados.
              </p>


            ) : (

              <div className="space-y-4">


                {
                  eventos.map((evento)=>(

                    <div
                      key={evento.id}
                      className="
                        border
                        rounded-xl
                        p-5
                        flex
                        justify-between
                        items-center
                      "
                    >

                      <div>

                        <h3 className="
                          text-xl
                          font-bold
                          text-black
                        ">
                          🎉 {evento.nombre}
                        </h3>


                        <p className="text-gray-600">
                          Fecha: {evento.fecha}
                        </p>


                      </div>



                      <div className="
                        flex
                        gap-3
                      ">


                        <EventQR
                          eventoId={evento.id}
                        />



                        <button

                          onClick={()=>
                            handleDelete(evento.id)
                          }

                          className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            px-5
                            py-2
                            rounded-xl
                          "

                        >
                          Eliminar

                        </button>


                      </div>


                    </div>

                  ))

                }


              </div>

            )

          }


        </div>






        <div className="
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        ">


          <h2 className="
            text-2xl
            font-bold
            text-black
            mb-6
          ">
            Crear Evento
          </h2>



          <div className="
            grid
            md:grid-cols-2
            gap-4
          ">


            <input

              value={nombre}

              onChange={(e)=>
                setNombre(e.target.value)
              }

              placeholder="Nombre del evento"

              className="
                border
                rounded-xl
                p-4
                text-black
              "

            />



            <input

              type="date"

              value={fecha}

              onChange={(e)=>
                setFecha(e.target.value)
              }

              className="
                border
                rounded-xl
                p-4
                text-black
              "

            />


          </div>




          <button

            onClick={handleCreate}

            disabled={creando}

            className="
              mt-6
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-8
              py-4
              rounded-xl
              font-bold
            "

          >

            {
              creando
              ? "Creando..."
              : "Crear Evento"
            }


          </button>



        </div>


      </div>


    </main>

  );


}