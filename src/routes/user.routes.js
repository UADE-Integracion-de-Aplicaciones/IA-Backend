'use strict';
module.exports = (app) => {
    var userController = require('../controllers/user.controller.');

    app.get('/login', (req,res) => userController.login(req, res)); 
    app.post('/register', (req, res) => userController.register(req,res));
}