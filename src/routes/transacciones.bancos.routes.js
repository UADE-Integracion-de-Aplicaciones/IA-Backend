const { pedirDinero, autorizar_compra } = require("../controllers/transacciones.controller");

module.exports = (app) => {
  app.post("/transacciones/bancos/pedir_dinero", (req, res) =>
    // #swagger.tags = ['Transacciones']
    // #swagger.description = 'Endpoint para extraer dinero de una cuenta del cliente.'
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    // #swagger.parameters['cantidad'] = { description: 'Cantidad a extraer de la cuenta.' }
    // #swagger.parameters['dni'] = { description: 'DNI del cliente.' }
    pedirDinero(req, res)
  );

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
