'use strict';
module.exports = (app) => {
    var cuentaController = require('../controllers/cuenta.controller');

    app.post('/cuenta/getResumen', (req,res) => 
        // #swagger.tags = ['Cuenta']
        // #swagger.description = 'Endpoint para obtener resumen de una cuenta por numero de cuenta.'
        // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    cuentaController.getResumenCuenta(req, res)); 

    app.delete('/cuenta/delete', (req,res) =>
        // #swagger.tags = ['Cuenta']
        // #swagger.description = 'Endpoint para eliminar una cuenta.'
        // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
     cuentaController.delete(req, res)); 

    app.put('/cuenta/update', (req,res) => 

    cuentaController.update(req, res)); 

    app.post('/cuenta/create', (req,res) => 
        // #swagger.tags = ['Cuenta']
        // #swagger.description = 'Endpoint para crear una cuenta.'
        // #swagger.parameters['id'] = { description: 'ID de cliente.' }
    cuentaController.create(req, res)); 

    app.get('/cuenta/getCuenta', (req,res) => 
        // #swagger.tags = ['Cuenta']
        // #swagger.description = 'Endpoint para obtener una cuenta por numero de cuenta.'
        // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    cuentaController.getCuenta(req, res));

    app.get('/cuenta/getSaldo', (req,res) => 
        // #swagger.tags = ['Cuenta']
        // #swagger.description = 'Endpoint para obtener el saldo de una cuenta por numero de cuenta.'
        // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    cuentaController.getSaldo(req, res)); 

}