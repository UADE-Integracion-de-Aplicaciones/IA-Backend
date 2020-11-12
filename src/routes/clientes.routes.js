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

  app.put("/clientes", (req, res) => 
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para modificar un cliente.'
    // #swagger.parameters['id'] = { description: 'ID de cliente.' }
    // #swagger.parameters['nombre'] = { description: 'Nombre del cliente.' }
    // #swagger.parameters['apellido'] = { description: 'Apellido del cliente.' }
    // #swagger.parameters['email'] = { description: 'Emaill de cliente.' }
    // #swagger.parameters['domicilio_barrio'] = { description: 'ID de cliente.' }
    // #swagger.parameters['domicilio_calle'] = { description: 'ID de cliente.' }
    // #swagger.parameters['domicilio_ciudad'] = { description: 'ID de cliente.' }
    // #swagger.parameters['domicilio_numero'] = { description: 'ID de cliente.' }
    // #swagger.parameters['domicilio_piso'] = { description: 'ID de cliente.' }
    // #swagger.parameters['domicilio_apartamento'] = { description: 'ID de cliente.' }
    // #swagger.parameters['fecha_nacimiento'] = { description: 'ID de cliente.' }
    // #swagger.parameters['pregunta1'] = { description: 'ID de cliente.' }
    // #swagger.parameters['pregunta1_respuesta'] = { description: 'ID de cliente.' }
    // #swagger.parameters['pregunta2'] = { description: 'ID de cliente.' }
    // #swagger.parameters['pregunta2_respuesta'] = { description: 'ID de cliente.' }
    // #swagger.parameters['pregunta3'] = { description: 'ID de cliente.' }
    // #swagger.parameters['pregunta3_respuesta'] = { description: 'ID de cliente.' }
  
  clientesController.modify(req, res));

  app.get("/clientes/dni", (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para buscar un cliente por el DNI.'
    // #swagger.parameters['dni'] = { description: 'DNI de cliente.' }

    clientesController.buscarClientePorDni(req, res);
  });

  app.get("/clientes/cbu", (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para buscar un cliente por el CBU.'
    // #swagger.parameters['cbu'] = { description: 'CBU de cliente.' }

    clientesController.buscarClientePorCbu(req, res);
  });

  app.post("/clientes/verificar", (req, res) =>
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Endpoint para verificar un cliente.'
    // #swagger.parameters['id'] = { description: 'ID de cliente.' }
    clientesController.verificarCliente(req, res)
  );
};
