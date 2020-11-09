"use strict";

const {
  depositar,
  extraer,
} = require("../controllers/transacciones.controller");

module.exports = (app) => {
  app.get("/transacciones", (req, res) =>
    transactionController.getMovimientos(req, res)
  );
  app.post("/transacciones/depositar", (req, res) => depositar(req, res));
  app.post("/transacciones/extraer", (req, res) => extraer(req, res));
};
