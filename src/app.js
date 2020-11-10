const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
var cors = require("cors");

const swaggerAutogen = require("swagger-autogen")();

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../resource/swagger/swagger_output.json");
const { db, syncDb } = require("./sequelize/models");

// This will be our application entry. We'll setup our server here.
const http = require("http");

const app = express();
(async () => {
  await syncDb(true);
})();
app.use(express.json());

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true })); //Setea true para recibir reuest en el url
app.use(cors()); //Habilita conexion segura HTTPS

//Seteamos los endpoints, cada uno llama a un archivo de endppoints distinto
app.get("/", (req, res) => res.status(200).send("Hello World!"));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

require("./routes/client.routes")(app);
require("./routes/user.routes")(app);
require("./routes/transacciones.routes")(app);
require("./routes/cuenta.routes")(app);
require("./routes/facturas.routes")(app);

module.exports = app;
