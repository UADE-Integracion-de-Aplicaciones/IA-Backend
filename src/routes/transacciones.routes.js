"use strict";

const {
  depositar,
  extraer,
  pagarServicio,
  transferir,
  recibirDesdeOtroBanco,
} = require("../controllers/transacciones.controller");

module.exports = (app) => {
  app.post("/transacciones/banco/extraer", (req, res) =>
    // #swagger.tags = ['Transacciones']
    // #swagger.description = 'Endpoint para extraer dinero de una cuenta del cliente.'
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    // #swagger.parameters['cantidad'] = { description: 'Cantidad a extraer de la cuenta.' }
    // #swagger.parameters['dni'] = { description: 'DNI del cliente.' }
    extraer(req, res)
  );

  app.post("/transacciones/banco/depositar", (req, res) =>
    // #swagger.tags = ['Transacciones']
    // #swagger.description = 'Endpoint para depositar dinero en cuenta del cliente o de tercero.'
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    // #swagger.parameters['cbu'] = { description: 'CBU de cuenta de tercero.' }
    // #swagger.parameters['cantidad'] = { description: 'Cantidad a extraer de la cuenta.' }
    depositar(req, res)
  );

  app.post("/transacciones/banco/pagar_servicio", (req, res) =>
    // #swagger.tags = ['Transacciones']
    // #swagger.description = 'Endpoint para pagar servicio en cuenta del cliente mediante el ejecutivo de banco.'
    // #swagger.parameters['facturas_ids'] = { description: 'IDs de facturas a pagar.' }
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    // #swagger.parameters['cantidad'] = { description: 'Cantidad a total a pagar.' }
    // #swagger.parameters['dni'] = { description: 'DNI del ejecutivo de banco.' }
    pagarServicio(req, res)
  );

  app.post("/transacciones/clientes/pagar_servicio", (req, res) =>
    // #swagger.tags = ['Transacciones']
    // #swagger.description = 'Endpoint para pagar servicio mediante el cliente.'
    // #swagger.parameters['facturas_ids'] = { description: 'IDs de facturas a pagar.' }
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    // #swagger.parameters['cantidad'] = { description: 'Cantidad a total a pagar.' }
    pagarServicio(req, res)
  );

  app.post("/transacciones/clientes/transferir", (req, res) =>
    transferir(req, res)
  );

  app.post("/b2b/transacciones/transferir", (req, res) =>
    recibirDesdeOtroBanco(req, res)
  );
};
