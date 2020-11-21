const {
  CantidadInvalidaError,
  ClienteNoExisteError,
  CuentaNoExisteError,
  DesconocidoError,
  DesconocidoBDError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
  CantidadMenorQueTotalFacturasError,
  CantidadMayorQueTotalFacturasError,
  TokenInvalidoError,
  FacturasNoExistenError,
} = require("../daos/errors");

const {
  depositarEnCuentaPropia,
  depositarEnCuentaDeTercero,
  extraerDineroDeCuenta,
  pagarServicioComoCliente,
  pagarServicioComoBanco,
  pagarServicioConEfectivo,
  transferirDinero,
} = require("../daos/transacciones.dao");

const { extraerDeCuentaEntreBancos } = require("../daos/transacciones.dao");
const { buscarFacturasPorIds } = require("../daos/facturas.dao");
const { Error } = require("../daos/errors");
const { BANCOS_INFO } = require("../daos/common");

module.exports = {
  async depositar(req, res) {
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
      const { usuario } = res.locals;
      const cantidadFloat = parseFloat(cantidad);
      console.log(cantidadFloat);
      await depositarFunction({ dni, usuario, cantidad: cantidadFloat });

      return res.status(200).json({ mensaje: "deposito realizado" });
    } catch (error) {
      const mensajes_error = [
        CantidadInvalidaError.mensaje,
        ClienteNoExisteError.mensaje,
        CuentaNoExisteError.mensaje,
        DesconocidoBDError.mensaje,
      ];
      if (mensajes_error.includes(error.mensaje)) {
        return res.status(400).json({ error });
      } else {
        return res.status(500).json({ mensaje: new DesconocidoError() });
      }
    }
  },

  async extraer(req, res) {
    const { body } = req;
    const { numero_cuenta, dni, cantidad } = body;

    try {
      const { usuario } = res.locals;
      const cantidadFloat = parseFloat(cantidad);
      await extraerDineroDeCuenta({
        numero_cuenta,
        dni,
        cantidad: cantidadFloat,
        usuario,
      });

      return res.status(200).json({ mensaje: "extracción realizada" });
    } catch (error) {
      const mensajes_error = [
        CantidadInvalidaError.mensaje,
        ClienteNoExisteError.mensaje,
        CuentaNoExisteError.mensaje,
        CuentaNoAsociadaAlClienteError.mensaje,
        CuentaConSaldoInsuficienteError.mensaje,
        DesconocidoBDError.mensaje,
      ];
      if (mensajes_error.includes(error.mensaje)) {
        return res.status(400).json({ error });
      } else {
        return res.status(500).json({ mensaje: new DesconocidoError() });
      }
    }
  },

  async pagarServicio(req, res) {
    const { body } = req;
    const { facturas_ids, cantidad } = body;

    let pagarServicioFunction;
    if (body.hasOwnProperty("numero_cuenta")) {
      const { numero_cuenta } = body;
      if (body.hasOwnProperty("dni")) {
        const { dni } = body;
        pagarServicioFunction = pagarServicioComoBanco({ dni, numero_cuenta });
      } else {
        pagarServicioFunction = pagarServicioComoCliente({ numero_cuenta });
      }
    } else {
      pagarServicioFunction = pagarServicioConEfectivo;
    }

    try {
      const { usuario } = res.locals;
      const cantidadFloat = parseFloat(cantidad);
      const facturas = await buscarFacturasPorIds(facturas_ids);
      if (facturas.length == 0) {
        throw new FacturasNoExistenError();
      }

      await pagarServicioFunction({
        facturas,
        cantidad: cantidadFloat,
        usuario,
      });

      return res.status(200).json({ mensaje: "pago de servicios realizado" });
    } catch (error) {
      const mensajes_error = [
        ClienteNoExisteError.mensaje,
        CantidadInvalidaError.mensaje,
        CuentaNoExisteError.mensaje,
        CuentaConSaldoInsuficienteError.mensaje,
        CantidadMenorQueTotalFacturasError.mensaje,
        CantidadMayorQueTotalFacturasError.mensaje,
        DesconocidoBDError.mensaje,
        FacturasNoExistenError.mensaje,
      ];

      if (mensajes_error.includes(error.mensaje)) {
        return res.status(400).json({ error });
      } else {
        return res.status(500).json({ mensaje: new DesconocidoError() });
      }
    }
  },

  async pedirDinero(req, res) {
    const { body, headers } = req;
    const { cbu, cantidad, descripcion } = body;

    try {
      if (headers["x-banco-token"] !== BANCOS_INFO.BANCO_A.token) {
        throw new TokenInvalidoError();
      }

      if (!cbu || !cantidad || !descripcion) {
        throw new Error("faltan datos");
      }

      await extraerDeCuentaEntreBancos({ cbu, cantidad, descripcion });

      return res
        .status(200)
        .json({ mensaje: "extracción de dinero realizada" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },

  async transferir(req, res) {
    const { body } = req;
    const { cbu_origen, cbu_destino, cantidad } = body;

    try {
      if (!cbu_origen || !cbu_destino || !cantidad) {
        throw new Error("faltan datos");
      }

      const { usuario } = res.locals;

      await transferirDinero({ cbu_origen, cbu_destino, cantidad, usuario });

      return res.status(200).json({ mensaje: "transferencia realizada" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },
};
