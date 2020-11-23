require("dotenv").config();

const app = require("./app");
const planificarTareas = require("../src/tasks/scheduling");

// :::: LEER ESTO ::::
// NO HAGAMOS CARGA DE DATOS DE PRUEBA AL CORRER LA APP
// ESTO ME HA DADO MUCHOS PROBLEMAS. NO ES RECOMENDABLE
// VAMOS A USAR EL COMANDO npm run task:cargar_datos_prueba desde la terminal luego de levantar la BD
// ESTE COMANDO HACE EXACTAMENTE LO MISMO PERO CUANDO UNO LO DECIDA
// (async () => {
//   if (process.env.NODE_ENV === "development") {
//     try {
//       console.log("LOADING DATA");
//       await require("../tests/fixtures").crearData();
//     } catch (error) {
//       console.log(error);
//     }
//   }
// })();

planificarTareas();

const port = parseInt(process.env.PORT, 10) || 8080;
app.set("port", port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
