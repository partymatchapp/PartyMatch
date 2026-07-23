"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useUser } from "@/context/UserContext";

import {
  listenMessages,
  sendMessage,
  markMessagesAsRead
} from "@/lib/chat";



export default function ChatPage(){


  const router = useRouter();

  const params = useParams();

  const chatId = params.id as string;


  const { user } = useUser();



  const [mensajes,setMensajes] = useState<any[]>([]);

  const [texto,setTexto] = useState("");

  const [nombre,setNombre] = useState("Chat");

  const [foto,setFoto] = useState("");

  const [eventoId,setEventoId] = useState("");

  const [mostrarEmojis,setMostrarEmojis] = useState(false);









  useEffect(()=>{


    if(!chatId || !user){

      return;

    }


    const usuarioActual = user;





    async function cargarChat(){



      const chatSnap = await getDoc(

        doc(

          db,

          "chats",

          chatId

        )

      );





      if(!chatSnap.exists()){

        return;

      }





      const chat:any = chatSnap.data();





      setEventoId(

        chat.eventoId || ""

      );





      const otroUsuario = chat.usuarios.find(

        (id:string)=>id !== usuarioActual.uid

      );





      if(otroUsuario){



        const usuarioSnap = await getDoc(

          doc(

            db,

            "usuarios",

            otroUsuario

          )

        );



        if(usuarioSnap.exists()){


          const datos:any = usuarioSnap.data();


          setNombre(

            datos.nombre || "Usuario"

          );


          setFoto(

            datos.foto || ""

          );


        }


      }



    }





    cargarChat();





    const cancelar = listenMessages(

      chatId,

      (lista)=>{


        setMensajes(lista);


      }

    );





    markMessagesAsRead(

      chatId,

      usuarioActual.uid

    );





    return ()=>{

      cancelar();

    };



  },[chatId,user]);









  async function enviar(){



    if(

      !texto.trim() ||

      !user

    ){

      return;

    }





    await sendMessage(

      chatId,

      user.uid,

      texto.trim()

    );





    setTexto("");



  }







  function manejarTecla(

    e:React.KeyboardEvent<HTMLInputElement>

  ){


    if(e.key==="Enter"){


      e.preventDefault();


      enviar();


    }


  }







  const emojis=[

    "😀",

    "😂",

    "😍",

    "❤️",

    "👍",

    "🔥",

    "🎉",

    "😎"

  ];









  return(


    <main className="
      min-h-screen
      bg-black
      p-4
    ">



      <div className="
        max-w-md
        mx-auto
        h-screen
        flex
        flex-col
      ">





        <header className="
          relative
          flex
          justify-center
          items-center
          text-white
          py-4
        ">



          <button

            onClick={()=>{


              if(eventoId){


                router.push(

                  `/evento/${eventoId}`

                );


              }


            }}

            className="
              absolute
              left-0
              bg-white
              text-black
              px-4
              py-2
              rounded-xl
              font-bold
            "

          >

            🏠 Casa

          </button>







          <div className="text-center">


            {
              foto && (

                <img

                  src={foto}

                  className="
                    w-14
                    h-14
                    rounded-full
                    mx-auto
                    object-cover
                  "

                />

              )

            }



            <h1 className="
              text-xl
              font-bold
            ">

              {nombre}

            </h1>



          </div>



        </header>









        <section className="
          flex-1
          bg-white
          rounded-3xl
          p-4
          overflow-y-auto
          space-y-3
        ">


          {
            mensajes.map((mensaje)=>(


              <div

                key={mensaje.id}

                className={`
                  bg-white
                  border
                  border-black
                  rounded-2xl
                  p-3
                  text-black
                  font-[Arial_Black]
                  max-w-[80%]
                  ${
                    mensaje.enviadoPor===user?.uid
                    ?
                    "ml-auto"
                    :
                    "mr-auto"
                  }
                `}

              >

                {mensaje.texto}


              </div>


            ))

          }


        </section>









        {
          mostrarEmojis && (


            <div className="
              bg-white
              rounded-xl
              p-3
              flex
              gap-3
              mt-3
            ">


              {
                emojis.map((emoji)=>(


                  <button

                    key={emoji}

                    onClick={()=>setTexto(

                      anterior=>anterior+emoji

                    )}

                    className="
                      text-2xl
                    "

                  >

                    {emoji}

                  </button>


                ))

              }


            </div>


          )

        }









        <footer className="
          mt-3
          flex
          gap-2
        ">



          <button

            onClick={()=>setMostrarEmojis(

              !mostrarEmojis

            )}

            className="
              bg-white
              text-black
              rounded-xl
              px-3
            "

          >

            😊

          </button>





          <input

            value={texto}

            onChange={(e)=>setTexto(e.target.value)}

            onKeyDown={manejarTecla}

            placeholder="Escribí un mensaje..."

            className="
              flex-1
              bg-white
              text-black
              rounded-xl
              px-4
              py-3
              font-[Comic_Sans_MS]
            "

          />





          <button

            onClick={enviar}

            className="
              bg-white
              text-black
              rounded-xl
              px-4
              font-bold
            "

          >

            ➤

          </button>




        </footer>





      </div>


    </main>


  );


}