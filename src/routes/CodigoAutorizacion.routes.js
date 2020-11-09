'use strict';
module.exports = (app) => {
    var codigoAutController = require('../controllers/client');

    app.get('/codigoAutorizacion', (req,res) => codigoAutController.validarCodigo(req, res)); 
    app.post('/codigoAutorizacion', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para crear un cliente.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }

        /* #swagger.parameters['filtro'] = {
               description: 'Un filtro.',
               type: 'string'
        } */
        codigoAutController.generarCodigo(req, res)
    }); 
}