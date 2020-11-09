'use strict';
module.exports = (app) => {
    var clientController = require('../controllers/client');

    app.get('/client', (req,res) => clientController.buscarCliente(req, res)); 
    app.delete('/client', (req,res) => clientController.delete(req, res)); 
    app.post('/client', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para crear un cliente.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }

        /* #swagger.parameters['filtro'] = {
               description: 'Un filtro.',
               type: 'string'
        } */
        clientController.create(req, res)
    }); 
    app.put('/client', (req,res) => clientController.modify(req, res)); 
}