'use strict';
module.exports = (app) => {
    var cuentaController = require('../controllers/cuenta');

    app.get('/cuenta', (req,res) => cuentaController.getCuenta(req, res)); 
    app.delete('/cuenta', (req,res) => cuentaController.delete(req, res)); 
    app.post('/cuenta', (req,res) => cuentaController.create(req, res)); 
    app.put('/cuenta', (req,res) => cuentaController.update(req, res)); 
}