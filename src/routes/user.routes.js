'use strict';
module.exports = (app) => {
    var userController = require('../controllers/user.controller.');

    app.get('/login', (req,res) => {
            // #swagger.tags = ['Usuario']
            // #swagger.description = 'Endpoint para crear un usuario.'
            // #swagger.parameters['nombreUsuario'] = { description: 'nombre de usuario.'}
            // #swagger.parameters['clave'] = { description: 'clave de usuario.', type: 'string' }
            userController.login(req, res)}
        ); 
    app.post('/register', (req, res) => userController.register(req,res));
}