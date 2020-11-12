require("dotenv").config();
const { syncDb } = require("./sequelize/models");
const app = require("./app");
const planificarTareas = require("../src/tasks/scheduling");

(async () => {
  await syncDb(false);

  if (process.env.NODE_ENV === "development") {
    try {
      console.log("LOADING DATA");
      await require("../tests/fixtures").crearData();
      let lpt = await require("../tests/fixtures").obtenerUsuarioDePrueba();
      // console.log(lpt.get("id"),lpt.get("nombre_usuario"))
      let cliente = await require("../tests/fixtures").obtenerClienteDePrueba();
      // console.log(cliente.usuario, cliente.id)
    } catch (error) {
      console.log(error);
    }
  }
})();

planificarTareas();

const port = parseInt(process.env.PORT, 10) || 8080;
app.set("port", port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
