"use client";


type Props = {

  abierto:boolean;

  nombre:string;

  foto:string;

  onCerrar:()=>void;

  onEnviarMensaje:()=>void;

};





export default function MatchModal({

  abierto,

  nombre,

  foto,

  onCerrar,

  onEnviarMensaje

}:Props){



  if(!abierto){

    return null;

  }



  return (

    <div

      className="
        fixed
        inset-0
        z-50
        bg-black/80
        backdrop-blur
        flex
        items-center
        justify-center
        p-6
      "

    >


      <div

        className="
          w-full
          max-w-md
          bg-gradient-to-br
          from-slate-800
          to-blue-950
          rounded-3xl
          p-8
          text-center
          shadow-2xl
          border
          border-blue-400/40
        "

      >



        <h1 className="
          text-4xl
          font-bold
          text-white
          mb-6
        ">

          🎉 ¡Es un Match!

        </h1>





        <img

          src={foto}

          alt={nombre}

          className="
            w-40
            h-40
            rounded-full
            object-cover
            mx-auto
            border-4
            border-white
          "

        />





        <h2 className="
          text-2xl
          font-bold
          text-white
          mt-5
        ">

          {nombre}

        </h2>





        <p className="
          text-gray-300
          mt-3
        ">

          A los dos les gustaron sus perfiles ❤️

        </p>







        <button

          onClick={onEnviarMensaje}

          className="
            w-full
            mt-8
            bg-blue-500
            text-white
            rounded-xl
            py-4
            font-bold
            text-lg
          "

        >

          💬 Enviar mensaje

        </button>







        <button

          onClick={onCerrar}

          className="
            w-full
            mt-3
            bg-black
            text-white
            rounded-xl
            py-4
          "

        >

          Seguir descubriendo

        </button>





      </div>


    </div>

  );

}