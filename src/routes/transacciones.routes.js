"use strict";

const { depositar } = require("../controllers/transacciones.controller");

module.exports = (app) => {
  app.get("/transacciones", (req, res) =>
    transactionController.getMovimientos(req, res)
  );
  app.post("/transacciones/depositar", (req, res) => depositar(req, res));
};
