"use strict";

const {
  depositar,
  extraer,
  pagarServicio,
} = require("../controllers/transacciones.controller");

module.exports = (app) => {
  app.post("/transacciones/banco/extraer", (req, res) => extraer(req, res));
  app.post("/transacciones/banco/depositar", (req, res) => depositar(req, res));
  app.post("/transacciones/banco/pagar_servicio", (req, res) =>
    pagarServicio(req, res)
  );
  app.post("/transacciones/clientes/pagar_servicio", (req, res) =>
    pagarServicio(req, res)
  );
};
