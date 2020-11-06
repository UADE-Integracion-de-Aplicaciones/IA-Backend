'use strict';
module.exports = (app) => {
    var transactionController = require('../controllers/transaction');

    app.post('/transaction', (req,res) => transactionController.getMovimientos(req, res)); 
    app.get('/transaction', (req,res) => transactionController.create(req, res));  

}