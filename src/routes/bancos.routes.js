const {
    autorizar_compra
  } = require("../controllers/transacciones.controller");
  
  module.exports = (app) => {
    app.post("/autorizar_compra", (req, res) => {
        // #swagger.tags = ['Usuario']
        // #swagger.description = 'Endpoint para registrar un usuario.'
        // #swagger.parameters['cbu'] = { description: 'cbu de la cuenta a depositar.', type: 'string' }
        // #swagger.parameters['nombre_banco_cbu'] = { description: 'nombre del banco al que pertenece la cuenta.'}
        // #swagger.parameters['importe'] = { description: 'Importe a depositar.', type: 'string' }
        // #swagger.parameters['cbu_establecimiento'] = { description: 'cbu del establecimiento que realiza la transaccion.', type: 'string' }
        autorizar_compra(req,res)
    })
  };
  