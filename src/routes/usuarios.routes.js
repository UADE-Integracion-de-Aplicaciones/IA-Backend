const { login, registrar } = require("../controllers/usuarios.controller");

module.exports = (app) => {
  app.post("/login", (req, res) => {
    // #swagger.tags = ['Usuario']
    // #swagger.description = 'Endpoint loggin de un usuario.'
    // #swagger.parameters['nombre_usuario'] = { description: 'nombre de usuario.'}
    // #swagger.parameters['clave'] = { description: 'clave de usuario.', type: 'string' }
    login(req, res);
  });

  app.post("/clientes/usuario/registrar", (req, res) => {
    // #swagger.tags = ['Usuario']
    // #swagger.description = 'Endpoint para registrar un usuario.'
    // #swagger.parameters['nombre_usuario'] = { description: 'nombre de usuario.'}
    // #swagger.parameters['clave'] = { description: 'clave de usuario.', type: 'string' }
    // #swagger.parameters['rol_id'] = { description: 'id del rol del usuario.', type: 'string' }
    registrar(req, res);
  });
};
