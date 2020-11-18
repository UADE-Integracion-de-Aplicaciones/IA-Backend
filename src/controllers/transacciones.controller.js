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
} = require("../daos/errors");

const {
  depositarEnCuentaPropia,
  depositarEnCuentaDeTercero,
  extraerDineroDeCuenta,
  pagarServicioComoCliente,
  pagarServicioComoBanco,
  disminuirSaldoDeCuenta,
  aumentarSaldoDeCuenta
} = require("../daos/transacciones.dao");
const {
  MOVIMIENTOS_CUENTAS_TIPO
} = require("./../daos/common");

const { extraerDeCuentaEntreBancos } = require("../daos/transacciones.dao");
const { buscarFacturasPorIds } = require("../daos/facturas.dao");
const { Error } = require("../daos/errors");

const NOMBRE_ENTIDAD = "BANKAME";

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
    const { facturas_ids, numero_cuenta, cantidad } = body;

    let pagarServicioFunction;
    if (body.hasOwnProperty("dni")) {
      pagarServicioFunction = pagarServicioComoBanco(body.dni);
    } else {
      pagarServicioFunction = pagarServicioComoCliente;
    }

    try {
      const { usuario } = res.locals;
      const cantidadFloat = parseFloat(cantidad);
      const facturas = await buscarFacturasPorIds(facturas_ids);

      await pagarServicioFunction({
        numero_cuenta,
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
      ];

      if (mensajes_error.includes(error.mensaje)) {
        return res.status(400).json({ error });
      } else {
        return res.status(500).json({ mensaje: new DesconocidoError() });
      }
    }
  },

  async autorizar_compra(req, res) {
    const { body } = req;
    const { cbu, nombre_banco_cbu, importe, cbu_establecimiento } = body;

    try {
      if (!cbu || !nombre_banco_cbu || !importe || cbu_establecimiento) 
        throw new Error("faltan datos");
      
      if (importe <= 0) 
        throw new CantidadInvalidaError();

      const transaction = await db.sequelize.transaction();
      try {
        if (NOMBRE_ENTIDAD !== nombre_banco_cbu) {
          //El metodo de redirigir transaccion deberia pegarle al de ellos y hacer la transaccion
          const resultadoTransaccion = redirigirTransaccion(cbu, nombre_banco_cbu, importe, cbu_establecimiento);

          if (resultadoTransaccion.status !== 200)
            throw new Error("Error en la cuenta, esta no existe");
        } else {
          if (tieneSaldoEnCuentaParaPagar({ cuenta_origen, importe })) 
            throw new CuentaConSaldoInsuficienteError();

          const {cuenta_origen, cliente_origen} = await buscarClientePorCbu(cbu);

          console.log(cliente_origen)

          await crearMovimiento({
            cuenta: cuenta_origen,
            concepto: concepto_pago_consumidor,
            tipo: MOVIMIENTOS_CUENTAS_TIPO.DEBITA,
            cantidad: importe,
            usuario: cliente_origen.usuarios,
            transaction,
          });    

          await disminuirSaldoDeCuenta({ cuenta_origen, cantidad, transaction });
        }
    
        const {cuenta_destino, cliente_destino} = await buscarClientePorCbu(cbu);

        const movimiento = await crearMovimiento({
          cuenta: cuenta_destino,
          concepto: concepto_pago_cliente,
          tipo: MOVIMIENTOS_CUENTAS_TIPO.ACREDITA,
          cantidad: importe,
          usuario: cliente_destino.usuarios,
          transaction,
        });
    
        const comision = await cobrarComisionPorTransaccion(movimiento, {
          transaction,
        });

        const importeConComision = parseFloat(importe) - parseFloat(comision.get("cantidad"))
        await aumentarSaldoDeCuenta({ cuenta_destino, importeConComision, transaction });

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw new DesconocidoBDError();
      }

      return res.status(200).send(movimiento).json({ mensaje: "pago de servicios realizado" });
    } catch (error) {
      return res.status(404).json({ error });
    }
  },
};
