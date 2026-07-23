"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import {
  createEvent,
  getMyEvents,
  deleteEvent,
} from "@/lib/events";

import EventQR from "@/components/admin/EventQR";


type Evento = {
  id: string;
  nombre: string;
  fecha: string;
  activo?: boolean;
};


export default function AdminPage() {

  const { user } = useUser();

  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");

  const [eventos, setEventos] = useState<Evento[]>([]);

  const [creando, setCreando] = useState(false);
  const [cargando, setCargando] = useState(true);



  async function cargarEventos() {

    if (!user) return;


    try {

      setCargando(true);


      const resultado = await getMyEvents(user.uid);


      setEventos(resultado as Evento[]);


    } catch (error) {

      console.error(
        "Error cargando eventos:",
        error
      );


    } finally {

      setCargando(false);

    }

  }



  useEffect(() => {

    cargarEventos();

  }, [user]);





  async function handleCreate() {

    if (!user) return;


    if (!nombre.trim()) {

      alert(
        "Ingresá un nombre para el evento."
      );

      return;

    }


    if (!fecha) {

      alert(
        "Seleccioná una fecha."
      );

      return;

    }



    try {

      setCreando(true);


      await createEvent(
        nombre,
        fecha,
        user.uid
      );


      setNombre("");
      setFecha("");


      await cargarEventos();


    } catch(error) {

      console.error(error);

      alert(
        "No se pudo crear el evento."
      );


    } finally {

      setCreando(false);

    }

  }





  async function handleDelete(id:string){


    const confirmar = confirm(
      "¿Seguro que querés eliminar este evento?"
    );


    if(!confirmar) return;



    try {


      await deleteEvent(id);


      await cargarEventos();



    } catch(error) {


      console.error(error);


      alert(
        "No se pudo eliminar el evento."
      );


    }


  }





  return (

    <main className="min-h-screen bg-slate-100">


      <header className="bg-slate-900 text-white shadow-lg">

        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">


          <div>

            <h1 className="text-3xl font-bold">
              🎉 PartyMatch
            </h1>


            <p className="text-sm text-gray-300">
              Panel de Administración
            </p>


          </div>



          <div className="text-right">


            <p className="font-bold">
              {
                user?.displayName ||
                "Administrador"
              }
            </p>


            <p className="text-xs text-gray-400">
              {user?.email}
            </p>


          </div>


        </div>

      </header>





      <div className="max-w-6xl mx-auto p-6">



        <div className="grid md:grid-cols-4 gap-4 mb-8">


          <div className="bg-white rounded-2xl shadow p-5">

            <h2 className="text-gray-500 text-sm">
              Eventos
            </h2>


            <p className="text-3xl font-bold text-black mt-2">
              {eventos.length}
            </p>

          </div>


          <div className="bg-white rounded-2xl shadow p-5">

            <h2 className="text-gray-500 text-sm">
              Participantes
            </h2>

            <p className="text-3xl font-bold text-black mt-2">
              --
            </p>

          </div>


          <div className="bg-white rounded-2xl shadow p-5">

            <h2 className="text-gray-500 text-sm">
              Matches
            </h2>

            <p className="text-3xl font-bold text-black mt-2">
              --
            </p>

          </div>


          <div className="bg-white rounded-2xl shadow p-5">

            <h2 className="text-gray-500 text-sm">
              Mensajes
            </h2>

            <p className="text-3xl font-bold text-black mt-2">
              --
            </p>

          </div>


        </div>





        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">


          <h2 className="text-2xl font-bold text-black mb-6">
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


                        <h3 className="text-xl font-bold text-black">

                          🎉 {evento.nombre}

                        </h3>


                        <p className="text-gray-600">

                          Fecha: {evento.fecha}

                        </p>


                      </div>



                      <div className="flex gap-3">


                        <EventQR
                          eventoId={evento.id}
                        />



                        <button

                          onClick={()=>handleDelete(evento.id)}

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





        <div className="bg-white rounded-2xl shadow-lg p-8">


          <h2 className="text-2xl font-bold text-black mb-6">

            Crear Evento

          </h2>



          <div className="grid md:grid-cols-2 gap-4">


            <input

              value={nombre}

              onChange={(e)=>setNombre(e.target.value)}

              placeholder="Nombre del evento"

              className="border rounded-xl p-4 text-black"

            />



            <input

              type="date"

              value={fecha}

              onChange={(e)=>setFecha(e.target.value)}

              className="border rounded-xl p-4 text-black"

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