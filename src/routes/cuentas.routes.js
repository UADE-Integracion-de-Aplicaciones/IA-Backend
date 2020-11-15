const cuentaController = require("../controllers/cuentas.controller");

module.exports = (app) => {
  app.get("/cuentas/getResumen", (req, res) =>
    // #swagger.tags = ['Cuenta']
    // #swagger.description = 'Endpoint para obtener resumen de una cuenta por numero de cuenta.'
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    cuentaController.getResumenCuenta(req, res)
  );

  app.delete("/cuentas/delete", (req, res) =>
    // #swagger.tags = ['Cuenta']
    // #swagger.description = 'Endpoint para eliminar una cuenta.'
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    cuentaController.delete(req, res)
  );

  app.put("/cuentas/update", (req, res) => cuentaController.update(req, res));

  app.post("/cuentas", (req, res) =>
    // #swagger.tags = ['Cuenta']
    // #swagger.description = 'Endpoint para crear una cuenta.'
    // #swagger.parameters['id'] = { description: 'ID de cliente.' }
    cuentaController.crear(req, res)
  );

  app.get("/cuentas/getCuenta", (req, res) =>
    // #swagger.tags = ['Cuenta']
    // #swagger.description = 'Endpoint para obtener una cuenta por numero de cuenta.'
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    cuentaController.getCuenta(req, res)
  );

  app.get("/cuentas/getSaldo", (req, res) =>
    // #swagger.tags = ['Cuenta']
    // #swagger.description = 'Endpoint para obtener el saldo de una cuenta por numero de cuenta.'
    // #swagger.parameters['numero_cuenta'] = { description: 'Numero de cuenta.' }
    cuentaController.getSaldo(req, res)
  );
};
