const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
var cors = require("cors");

const swaggerAutogen = require("swagger-autogen")();

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../resource/swagger/swagger_output.json");

const app = express();
app.use(express.json());

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true })); //Setea true para recibir reuest en el url
app.use(cors()); //Habilita conexion segura HTTPS

//Seteamos los endpoints, cada uno llama a un archivo de endppoints distinto
//app.get("/", (req, res) => res.status(200).send("Hello World!"));
const { withJWTAuthMiddleware } = require("express-kun");
const protectedRouter = withJWTAuthMiddleware(app, process.env.APP_SECRET);

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

require("./routes")(app);
require("./routes/user.routes")(app);

require("./routes/clientes.routes")(protectedRouter);
require("./routes/transacciones.routes")(protectedRouter);
require("./routes/CodigoAutorizacion.routes")(protectedRouter);
require("./routes/cuenta.routes")(protectedRouter);
require("./routes/facturas.routes")(app);

module.exports = app;
