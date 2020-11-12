"use strict";

const clientesController = require("../controllers/clientes.controller");

module.exports = (app) => {
  app.get("/clientes", (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para buscar un cliente, se puede usar o id o dni o cuit (y sus combinaciones aunque no sean necesarias).'
    // #swagger.parameters['id'] = { description: 'ID de cliente.', type: 'string' }
    // #swagger.parameters['cuit'] = { description: 'CUIT de cliente.', type: 'string' }
    // #swagger.parameters['dni'] = { description: 'DNI de cliente.', type: 'string' }
    clientesController.buscarCliente(req, res);
  });
  app.post("/clientes", (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para crear un cliente.'
    // #swagger.parameters['id'] = { description: 'ID de cliente.' }

    clientesController.create(req, res);
  });
  app.delete("/clientes", (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para eliminar un cliente.'
    // #swagger.parameters['id'] = { description: 'ID de cliente.' }
    clientesController.delete(req, res);
  });

  app.put("/clientes", (req, res) => clientesController.modify(req, res));

  app.get("/clientes/dni", (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para buscar un cliente por el DNI.'
    // #swagger.parameters['dni'] = { description: 'DNI de cliente.' }

    clientesController.buscarClientePorDni(req, res);
  });

  app.get("/clientes/cbu", (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para buscar un cliente por el DNI.'
    // #swagger.parameters['cbu'] = { description: 'CUB de cliente.' }

    clientesController.buscarClientePorCbu(req, res);
  });

  app.post("/clientes/verificar", (req, res) =>
    clientesController.verificarCliente(req, res)
  );
};
