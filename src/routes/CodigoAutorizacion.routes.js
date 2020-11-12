'use strict';
// const checkJwtBuilder = require("../middleware/checkJwt");
// const checkJwt = checkJwtBuilder()
module.exports = (app) => {
    var codigoAutController = require('../controllers/CodigoAutorizacion.controller');

    app.get('/codigoAutorizacion', (req,res) => codigoAutController.validarCodigo(req, res)); 
    app.post('/codigoAutorizacion', (req,res) => {
        // #swagger.tags = ['Cliente']
        // #swagger.description = 'Endpoint para crear un cliente.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }

        /* #swagger.parameters['filtro'] = {
               description: 'Un filtro.',
               type: 'string'
        } */
        codigoAutController.generarCodigoRegistro(req, res)
    }); 
}