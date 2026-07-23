"use client";

import { useState } from "react";


type Persona = {

  id:string;
  nombre:string;
  foto:string;
  intereses?:string[];

};


type Props = {

  persona:Persona;

  onLike:()=>void;

  onDislike:()=>void;

};



export default function PersonCard({

  persona,

  onLike,

  onDislike

}:Props){


  const [animacion,setAnimacion] = useState("");

  const [bloqueado,setBloqueado] = useState(false);





  function reaccionar(

    tipo:"like"|"dislike"

  ){


    if(bloqueado){

      return;

    }



    setBloqueado(true);



    if(tipo==="like"){

      setAnimacion(
        "translate-x-[120%] rotate-12"
      );

    }else{

      setAnimacion(
        "-translate-x-[120%] -rotate-12"
      );

    }





    setTimeout(()=>{


      if(tipo==="like"){

        onLike();

      }else{

        onDislike();

      }


      setAnimacion("");

      setBloqueado(false);


    },300);



  }






  return (

    <div

      className={`
        relative
        w-full
        h-[650px]
        rounded-3xl
        overflow-hidden
        shadow-2xl
        border
        border-blue-400/40
        bg-black
        transition-transform
        duration-300
        ${animacion}
      `}

    >



      <img

        src={persona.foto}

        alt={persona.nombre}

        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "

      />




      <div

        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black
          via-black/40
          to-transparent
        "

      />





      <div

        className="
          absolute
          bottom-0
          w-full
          p-6
        "

      >



        <h2

          className="
            text-4xl
            font-bold
            text-white
            mb-4
          "

        >

          {persona.nombre}

        </h2>






        <div

          className="
            flex
            flex-wrap
            gap-2
            mb-8
          "

        >


          {
            persona.intereses?.map((interes)=>(


              <span

                key={interes}

                className="
                  bg-blue-500/30
                  backdrop-blur
                  border
                  border-blue-300/40
                  text-white
                  px-4
                  py-2
                  rounded-full
                  text-sm
                "

              >

                {interes}

              </span>


            ))
          }


        </div>






        <div

          className="
            flex
            justify-center
            gap-10
          "

        >



          <button

            disabled={bloqueado}

            onClick={()=>reaccionar("dislike")}

            className="
              w-20
              h-20
              rounded-full
              bg-black
              border
              border-gray-600
              text-white
              text-4xl
              shadow-xl
              hover:scale-110
              transition
            "

          >

            ❌

          </button>






          <button

            disabled={bloqueado}

            onClick={()=>reaccionar("like")}

            className="
              w-20
              h-20
              rounded-full
              bg-black
              border
              border-blue-400
              text-white
              text-4xl
              shadow-xl
              hover:scale-110
              transition
            "

          >

            ❤️

          </button>



        </div>




      </div>




    </div>

  );

}