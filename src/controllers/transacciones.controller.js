const {
  ClienteNoExisteError,
  CuentaNoExisteError,
  DesconocidoError,
} = require("../daos/errors");
const { depositarDineroEnCuenta } = require("../daos/transacciones.dao");

module.exports = {
  async depositar(req, res) {
    // TODO: eliminar cuando se tenga el iniciar session del usuario
    const { cargarData } = require("../../tests/fixtures");
    const { usuario } = await cargarData();
    ////////////
    const { params, body } = req;
    console.log(params);
    const { dni, cbu, cantidad } = body;
    try {
      await depositarDineroEnCuenta({
        dni,
        cbu,
        usuario,
        cantidad,
      });

      return res.status(200).json({ mensaje: "deposito realizado" });
    } catch (err) {
      console.log(err);
      if (
        err.message === "el cliente no existe o no está activo" ||
        err.message === "la cuenta no existe o no está activa"
      ) {
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
