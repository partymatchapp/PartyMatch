import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  getFirestore,
} from "firebase-admin/firestore";

import {
  getAuth,
} from "firebase-admin/auth";

import fs from "fs";
import path from "path";


// =====================================================
// CONFIGURACIÓN
// =====================================================

const CONTRASENA_INICIAL = "123456";


// =====================================================
// BUSCAR CREDENCIAL DE FIREBASE
// =====================================================

const secretsDir = path.join(
  process.cwd(),
  "secrets"
);


if (!fs.existsSync(secretsDir)) {

  throw new Error(
    "❌ No existe la carpeta secrets."
  );

}


const archivos = fs
  .readdirSync(secretsDir)
  .filter(
    (archivo) =>
      archivo.endsWith(".json")
  );


if (archivos.length === 0) {

  throw new Error(
    "❌ No se encontró ningún archivo JSON dentro de la carpeta secrets."
  );

}


if (archivos.length > 1) {

  throw new Error(
    "❌ Hay más de un archivo JSON dentro de secrets."
  );

}


const serviceAccountPath =
  path.join(
    secretsDir,
    archivos[0]
  );


const serviceAccount =
  JSON.parse(
    fs.readFileSync(
      serviceAccountPath,
      "utf8"
    )
  );


// =====================================================
// FIREBASE ADMIN
// =====================================================

if (!getApps().length) {

  initializeApp({

    credential:
      cert(serviceAccount),

  });

}


const db =
  getFirestore();


const auth =
  getAuth();


// =====================================================
// GENERAR USERNAME
// =====================================================

function generarUsername(
  nombre: string,
  usados: Set<string>
): string {

  let base =
    nombre
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]/g,
        ""
      );


  if (!base) {

    base = "usuario";

  }


  let username =
    base;

  let numero =
    2;


  while (
    usados.has(username)
  ) {

    username =
      `${base}${numero}`;

    numero++;

  }


  usados.add(username);


  return username;

}


// =====================================================
// MIGRACIÓN
// =====================================================

async function ejecutar() {

  console.log("");

  console.log(
    "=========================================="
  );

  console.log(
    " PARTY MATCH"
  );

  console.log(
    " MIGRACIÓN REAL DE USUARIOS"
  );

  console.log(
    "=========================================="
  );

  console.log("");

  console.log(
    "⚠️ ATENCIÓN"
  );

  console.log(
    "Se modificarán Authentication y Firestore."
  );

  console.log(
    "Los UID actuales serán conservados."
  );

  console.log(
    `Contraseña inicial: ${CONTRASENA_INICIAL}`
  );

  console.log("");

  console.log(
    "🔎 Leyendo usuarios de Firestore..."
  );


  const snapshot =
    await db
      .collection("usuarios")
      .get();


  console.log("");

  console.log(
    `👥 Usuarios encontrados: ${snapshot.size}`
  );

  console.log("");


  if (snapshot.empty) {

    console.log(
      "❌ No hay usuarios para migrar."
    );

    return;

  }


  // ===================================================
  // PREPARAR USERNAMES
  // ===================================================

  const usados =
    new Set<string>();


  const usuarios = [];


  for (
    const documento
    of snapshot.docs
  ) {

    const data =
      documento.data();


    const nombre =
      String(
        data.nombre || ""
      ).trim();


    const nombreMostrar =
      nombre ||
      "Sin nombre";


    const username =
      generarUsername(
        nombreMostrar,
        usados
      );


    usuarios.push({

      uid: documento.id,

      nombre:
        nombreMostrar,

      username,

      email:
        `${username}@partymatch.app`,

    });

  }


  // ===================================================
  // MOSTRAR LO QUE SE VA A HACER
  // ===================================================

  console.log(
    "=========================================="
  );

  console.log(
    " USUARIOS A MIGRAR"
  );

  console.log(
    "=========================================="
  );

  console.log("");


  for (
    const usuario
    of usuarios
  ) {

    console.log(
      `Nombre: ${usuario.nombre}`
    );

    console.log(
      `UID: ${usuario.uid}`
    );

    console.log(
      `Username: ${usuario.username}`
    );

    console.log(
      `Email interno: ${usuario.email}`
    );

    console.log(
      `Contraseña: ${CONTRASENA_INICIAL}`
    );

    console.log(
      "------------------------------------------"
    );

  }


  // ===================================================
  // CONFIRMACIÓN
  // ===================================================

  console.log("");

  console.log(
    "=========================================="
  );

  console.log(
    " INICIANDO MIGRACIÓN REAL"
  );

  console.log(
    "=========================================="
  );

  console.log("");


  let exitosos =
    0;

  let errores =
    0;

  let firestoreActualizados =
    0;


  const erroresDetalle:
    string[] = [];


  // ===================================================
  // PROCESAR USUARIOS
  // ===================================================

  for (
    const usuario
    of usuarios
  ) {

    console.log(
      `🔄 Migrando: ${usuario.username}`
    );


    try {

      // -------------------------------------------------
      // OBTENER USUARIO ACTUAL DE AUTH
      // -------------------------------------------------

      const usuarioAuth =
        await auth.getUser(
          usuario.uid
        );


      // -------------------------------------------------
      // VERIFICAR SI YA TIENE EMAIL/PASSWORD
      // -------------------------------------------------

      const proveedores =
        usuarioAuth.providerData.map(
          (provider) =>
            provider.providerId
        );


      const yaTienePassword =
        proveedores.includes(
          "password"
        );


      // -------------------------------------------------
      // ACTUALIZAR AUTH
      // -------------------------------------------------

      await auth.updateUser(
        usuario.uid,
        {

          email:
            usuario.email,

          password:
            CONTRASENA_INICIAL,

          displayName:
            usuario.nombre,

        }
      );


      console.log(
        `   ✅ Authentication actualizado`
      );


      // -------------------------------------------------
      // ACTUALIZAR FIRESTORE
      // -------------------------------------------------

      await db
        .collection("usuarios")
        .doc(usuario.uid)
        .set(

          {

            username:
              usuario.username,

            email:
              usuario.email,

            nombre:
              usuario.nombre,

            tipoLogin:
              "email",

            migrado:
              true,

            migradoEn:
              new Date(),

          },

          {

            merge:
              true,

          }

        );


      firestoreActualizados++;


      console.log(
        `   ✅ Firestore actualizado`
      );


      if (
        yaTienePassword
      ) {

        console.log(
          `   ℹ️ Ya tenía proveedor password`
        );

      }
      else {

        console.log(
          `   🔐 Convertido a Email/Password`
        );

      }


      exitosos++;


      console.log(
        `   🎉 ${usuario.username} MIGRADO`
      );


    }
    catch (error: any) {

      errores++;


      const mensaje =
        error?.message ||
        String(error);


      erroresDetalle.push(
        `${usuario.username} (${usuario.uid}): ${mensaje}`
      );


      console.error(
        `   ❌ ERROR: ${mensaje}`
      );

    }


    console.log(
      "------------------------------------------"
    );

  }


  // ===================================================
  // RESUMEN
  // ===================================================

  console.log("");

  console.log(
    "=========================================="
  );

  console.log(
    " RESUMEN DE MIGRACIÓN"
  );

  console.log(
    "=========================================="
  );

  console.log("");

  console.log(
    `👥 Usuarios encontrados: ${usuarios.length}`
  );

  console.log(
    `✅ Authentication migrados: ${exitosos}`
  );

  console.log(
    `🔥 Firestore actualizados: ${firestoreActualizados}`
  );

  console.log(
    `❌ Errores: ${errores}`
  );

  console.log("");


  // ===================================================
  // ERRORES
  // ===================================================

  if (
    erroresDetalle.length > 0
  ) {

    console.log(
      "=========================================="
    );

    console.log(
      " DETALLE DE ERRORES"
    );

    console.log(
      "=========================================="
    );

    console.log("");


    for (
      const error
      of erroresDetalle
    ) {

      console.log(
        `❌ ${error}`
      );

    }

    console.log("");

  }


  // ===================================================
  // RESULTADO FINAL
  // ===================================================

  if (
    errores === 0
  ) {

    console.log(
      "=========================================="
    );

    console.log(
      " 🎉 MIGRACIÓN COMPLETADA"
    );

    console.log(
      "=========================================="
    );

    console.log("");

    console.log(
      "Todos los usuarios fueron migrados correctamente."
    );

    console.log("");

    console.log(
      "Los UID originales fueron conservados."
    );

    console.log("");

    console.log(
      "Login de ejemplo:"
    );

    console.log(
      "Usuario: natan"
    );

    console.log(
      "Contraseña: 123456"
    );

    console.log("");

  }
  else {

    console.log(
      "=========================================="
    );

    console.log(
      "⚠️ MIGRACIÓN COMPLETADA CON ERRORES"
    );

    console.log(
      "=========================================="
    );

    console.log("");

    console.log(
      `Se migraron ${exitosos} de ${usuarios.length} usuarios.`
    );

    console.log(
      "Revisá los errores anteriores."
    );

    console.log("");

  }

}


// =====================================================
// EJECUTAR
// =====================================================

ejecutar()

  .catch(
    (error) => {

      console.error("");

      console.error(
        "❌ ERROR FATAL:"
      );

      console.error(
        error
      );

      console.error("");

      process.exit(1);

    }
  );
  