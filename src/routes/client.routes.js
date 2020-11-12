'use strict';

const client = require('../controllers/client');

module.exports = (app) => {
    var clientController = require('../controllers/client');
    app.get('/cliente', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para buscar un cliente, se puede usar o id o dni o cuit (y sus combinaciones aunque no sean necesarias).'
        // #swagger.parameters['id'] = { description: 'ID de cliente.', type: 'string' }
        // #swagger.parameters['cuit'] = { description: 'CUIT de cliente.', type: 'string' }
        // #swagger.parameters['dni'] = { description: 'DNI de cliente.', type: 'string' }
        clientController.buscarCliente(req, res)
    }); 
    app.post('/cliente', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para crear un cliente.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }
        
        clientController.create(req, res)
    }); 
    app.delete('/cliente', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para eliminar un cliente.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }
        clientController.delete(req, res)
    }); 

    app.put('/cliente', (req,res) => clientController.modify(req, res)); 

    app.get('/cliente/dni', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para buscar un cliente por el DNI.'
        // #swagger.parameters['dni'] = { description: 'DNI de cliente.' }
        
        clientController.buscarClientePorDni(req, res)
    }); 

    app.get('/cliente/cbu', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para buscar un cliente por el DNI.'
        // #swagger.parameters['cbu'] = { description: 'CUB de cliente.' }
        
        clientController.buscarClientePorCbu(req, res)
    }); 

    app.post('/cliente/verificar', (req, res) => clientController.verificarCliente(req, res));
}