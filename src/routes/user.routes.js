'use strict';
module.exports = (app) => {
    var userController = require('../controllers/user');
    app.post('/login', (req,res) => bookingController.create(req, res));
 
}