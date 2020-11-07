const express = require('express')
const logger = require("morgan")
const bodyParser = require("body-parser")

const swaggerAutogen = require('swagger-autogen')()

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./resource/swagger/swagger_output.json')

// This will be our application entry. We'll setup our server here.
const http = require('http');

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json());

//Seteamos los endpoints, cada uno llama a un archivo de endppoints distinto
require("./src/routes/user.routes.js")(app);
app.get('/', (req, res) => res.status(200).send('Hello World!'))


const port = parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

require('./src/routes/client.routes')(app);