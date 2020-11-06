'use strict';
module.exports = (app) => {
    var clientController = require('../controllers/client');

    app.get('/client', (req,res) => clientController.getClient(req, res)); 
    app.delete('/client', (req,res) => clientController.delete(req, res)); 
    app.post('/client', (req,res) => clientController.create(req, res)); 
    app.put('/client', (req,res) => clientController.update(req, res)); 
}