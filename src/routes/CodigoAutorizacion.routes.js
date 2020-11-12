'use strict';
// const checkJwtBuilder = require("../middleware/checkJwt");
// const checkJwt = checkJwtBuilder()
module.exports = (app) => {
    var codigoAutController = require('../controllers/CodigoAutorizacion.controller');

    app.get('/codigoAutorizacion', (req,res) => 
        // #swagger.tags = ['Clientes']
        // #swagger.description = 'Endpoint para validar un cliente y validar el codigo.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }
    codigoAutController.validarCodigo(req, res)); 

    app.post('/codigoAutorizacion', (req,res) => {
        // #swagger.tags = ['Clientes']
        // #swagger.description = 'Endpoint para crear un cliente.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }
        codigoAutController.generarCodigoRegistro(req, res)
    }); 
}