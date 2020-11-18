const { pedirDinero } = require("../controllers/transacciones.controller");

module.exports = (app) => {
  app.post("/transacciones/bancos/pedir_dinero", (req, res) =>
    // #swagger.tags = ['Transacciones']
    // #swagger.description = 'Endpoint para extraer dinero de una cuenta del cliente.'
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    // #swagger.parameters['cantidad'] = { description: 'Cantidad a extraer de la cuenta.' }
    // #swagger.parameters['dni'] = { description: 'DNI del cliente.' }
    pedirDinero(req, res)
  );
};
