'use strict';

const client = require('../controllers/client');

module.exports = (app) => {
    var clientController = require('../controllers/client');
    app.get('/client', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para buscar un cliente, se puede usar o id o dni o cuit (y sus combinaciones aunque no sean necesarias).'
        // #swagger.parameters['id'] = { description: 'ID de cliente.', type: 'string' }
        // #swagger.parameters['cuit'] = { description: 'CUIT de cliente.', type: 'string' }
        // #swagger.parameters['dni'] = { description: 'DNI de cliente.', type: 'string' }
        clientController.buscarCliente(req, res)
    }); 
    app.post('/client', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para crear un cliente.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }
        
        clientController.create(req, res)
    }); 
    app.delete('/client', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para eliminar un cliente.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }
        clientController.delete(req, res)
    }); 

    app.put('/client', (req,res) => clientController.modify(req, res)); 

    app.get('/client/verificar', (req, res) => clientController.verificarCliente(req, res));
}