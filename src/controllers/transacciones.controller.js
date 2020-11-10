const {
  CantidadInvalidaError,
  ClienteNoExisteError,
  CuentaNoExisteError,
  DesconocidoError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
} = require("../daos/errors");
const {
  depositarEnCuentaPropia,
  depositarEnCuentaDeTercero,
  extraerDineroDeCuenta,
} = require("../daos/transacciones.dao");

module.exports = {
  async depositar(req, res) {
    // TODO: eliminar cuando se tenga el iniciar session del usuario
    const { cargarData } = require("../../tests/fixtures");
    const { usuario } = await cargarData();
    ////////////

    const { body } = req;
    const { dni, cantidad } = body;

    let depositarFunction;
    if (body.hasOwnProperty("numero_cuenta")) {
      console.log("cuenta propia");
      depositarFunction = depositarEnCuentaPropia(body.numero_cuenta);
    } else if (body.hasOwnProperty("cbu")) {
      console.log("cuenta de tercero");
      depositarFunction = depositarEnCuentaDeTercero(body.cbu);
    }

    try {
      await depositarFunction({ dni, usuario, cantidad });

      return res.status(200).json({ mensaje: "deposito realizado" });
    } catch (err) {
      const mensajes_error = [
        CantidadInvalidaError.message,
        ClienteNoExisteError.message,
        CuentaNoExisteError.message,
      ];
      if (mensajes_error.includes(err.message)) {
        return res.status(404).json({ mensaje: err });
      } else {
        return res.status(500).json({ mensaje: new DesconocidoError() });
      }
    }
  },

  async extraer(req, res) {
    // TODO: eliminar cuando se tenga el iniciar session del usuario
    const { cargarData } = require("../../tests/fixtures");
    const { usuario } = await cargarData();
    ////////////

    const { body } = req;
    const { numero_cuenta, dni, cantidad } = body;

    try {
      await extraerDineroDeCuenta({ numero_cuenta, dni, cantidad, usuario });

      return res.status(200).json({ mensaje: "extracción realizada" });
    } catch (err) {
      const mensajes_error = [
        CantidadInvalidaError.message,
        ClienteNoExisteError.message,
        CuentaNoExisteError.message,
        CuentaNoAsociadaAlClienteError.message,
        CuentaConSaldoInsuficienteError.message,
      ];
      if (mensajes_error.includes(err.message)) {
        return res.status(404).json({ mensaje: err });
      } else {
        return res.status(500).json({ mensaje: new DesconocidoError() });
      }
    }
  },

  create(req, res) {
    return transaction
      .create({})
      .then((transaction) => res.status(200).send(transaction))
      .catch((error) => res.status(400).send(error));
  },

  //Movimientos de una cuenta
  getMovimientos(req, res) {
    //
    // logic
    //
    res.status(200).send("get movimientos");
  },
};
