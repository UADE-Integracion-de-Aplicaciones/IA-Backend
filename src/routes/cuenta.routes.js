'use strict';
module.exports = (app) => {
    var cuentaController = require('../controllers/cuenta.controller');

    app.get('/cuenta/getResumen', (req,res) => cuentaController.getResumenCuenta(req, res));  
    app.delete('/cuenta/delete', (req,res) => cuentaController.delete(req, res)); 
    app.put('/cuenta/update', (req,res) => cuentaController.update(req, res)); 

    app.post('/cuenta/create', (req,res) => cuentaController.create(req, res)); 
    app.get('/cuenta/getCuenta', (req,res) => cuentaController.getCuenta(req, res));
    app.get('/cuenta/getSaldo', (req,res) => cuentaController.getSaldo(req, res)); 

}