const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { withJWTAuthMiddleware } = require("./middleware/auth.middleware");

const swaggerAutogen = require("swagger-autogen")();

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../resource/swagger/swagger_output.json");
// NO MOVER DE AQUI POR FAVOR
// const { syncDb } = require("./sequelize/models");
// (async () => {
//   await syncDb(false, false);
// })();
//

const app = express();
app.use(express.json());

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true })); //Setea true para recibir reuest en el url
app.use(cors()); //Habilita conexion segura HTTPS

//Seteamos los endpoints, cada uno llama a un archivo de endppoints distinto
//app.get("/", (req, res) => res.status(200).send("Hello World!"));
const protectedRouter = withJWTAuthMiddleware(app, process.env.APP_SECRET);

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

require("./routes")(app);
require("./routes/usuarios.routes")(app);

require("./routes/clientes.routes")(protectedRouter);
require("./routes/transacciones.routes")(protectedRouter);
require("./routes/cuentas.routes")(protectedRouter);
require("./routes/facturas.routes")(app);

module.exports = app;
