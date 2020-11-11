"use strict";

const {
  depositar,
  extraer,
  pagarServicioComoCliente,
} = require("../controllers/transacciones.controller");

module.exports = (app) => {
  app.post("/transacciones/depositar", (req, res) => depositar(req, res));
  app.post("/transacciones/extraer", (req, res) => extraer(req, res));
  app.post("/transacciones/clientes/pagar_servicio", (req, res) =>
    pagarServicioComoCliente(req, res)
  );
};
