const express = require('express')
const logger = require("morgan")
const bodyParser = require("body-parser")

// This will be our application entry. We'll setup our server here.
const http = require('http');

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).send('Hello World!'))

const port = parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))