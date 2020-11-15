"use strict";
module.exports = (app) => {
  var userController = require("../controllers/usuarios.controller");

  app.post("/login", (req, res) => {
    // #swagger.tags = ['Usuario']
    // #swagger.description = 'Endpoint loggin de un usuario.'
    // #swagger.parameters['nombre_usuario'] = { description: 'nombre de usuario.'}
    // #swagger.parameters['clave'] = { description: 'clave de usuario.', type: 'string' }
    userController.login(req, res);
  });

  app.post("/register", (req, res) => {
    // #swagger.tags = ['Usuario']
    // #swagger.description = 'Endpoint para registrar un usuario.'
    // #swagger.parameters['nombre_usuario'] = { description: 'nombre de usuario.'}
    // #swagger.parameters['clave'] = { description: 'clave de usuario.', type: 'string' }
    // #swagger.parameters['rol_id'] = { description: 'id del rol del usuario.', type: 'string' }
    userController.register(req, res);
  });
};
