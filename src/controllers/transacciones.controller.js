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
  aumentarSaldoDeCuenta,
  pedirDineroAOtroBanco,
  tieneSaldoEnCuentaParaPagar,
  buscarConcepto
} = require("../daos/transacciones.dao");

const {
  MOVIMIENTOS_CUENTAS_TIPO,
  BANCOS_INFO,
  MOVIMIENTOS_CUENTAS_CONCEPTO
} = require("./../daos/common");

const {
  buscarClientePorCbu
} = require("../daos/clientes.dao");

const { db } = require("../sequelize/models");

const { extraerDeCuentaEntreBancos } = require("../daos/transacciones.dao");
const { buscarFacturasPorIds } = require("../daos/facturas.dao");
const { Error } = require("../daos/errors");

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

  async autorizarCompra(req, res) {
    const { body } = req;
    const { cbu, nombre_banco_cbu, importe, cbu_establecimiento } = body;

    try {
      if (!cbu || !nombre_banco_cbu || !importe || !cbu_establecimiento) 
        throw new Error("faltan datos");
      
      if (importe <= 0) 
        throw new CantidadInvalidaError();

      const transaction = await db.sequelize.transaction();
      const cantidad = importe;

      try {
        let {cuenta, cliente} = await  (cbu_establecimiento);
       
        const cuenta_destino = cuenta;
        const cliente_destino = cliente;

        if (BANCOS_INFO.BANCO_A.nombre === nombre_banco_cbu) {
          const descripcion = "Compra en " + cliente_destino.get("nombre") + " " + cliente_destino.get("apellido");
          
          //El metodo de redirigir transaccion deberia pegarle al de ellos y hacer la transaccion
          const token = BANCOS_INFO.BANCO_A.token;
          const resultadoTransaccion = pedirDineroAOtroBanco(cbu, cantidad, descripcion, token);

          //TODO
          if (resultadoTransaccion.status !== 200)
            throw new Error(resultadoTransaccion.message);
        } else {
          //Cuenta del cliente
          let {cuenta, cliente} = await buscarClientePorCbu(cbu);
          const cuenta_origen = cuenta;
          const cliente_origen = cliente;

          if (tieneSaldoEnCuentaParaPagar({ cuenta: cuenta_origen, cantidad })) 
            throw new CuentaConSaldoInsuficienteError();
            
          const concepto_origen = await buscarConcepto(MOVIMIENTOS_CUENTAS_CONCEPTO.COMPRA_EN_ESTABLECIMIENTO); //Importar
          const usuario_origen = cliente_origen.get("usuario"); 
          
          console.log( cliente_origen)

          await crearMovimiento({
            cuenta: cuenta_origen,
            concepto: concepto_origen,
            tipo: MOVIMIENTOS_CUENTAS_TIPO.DEBITA,
            cantidad, 
            usuario: usuario_origen,
            transaction,
          });    

          await disminuirSaldoDeCuenta({ cuenta: cuenta_origen, cantidad, transaction });
        }
            
        const concepto_destino = await buscarConcepto(MOVIMIENTOS_CUENTAS_CONCEPTO.VENTA_DEL_ESTABLECIMIENTO);
        const usuario_destino = cliente_destino.get("usuario"); 
        await crearMovimiento({
          cuenta: cuenta_destino,
          concepto: concepto_destino,
          tipo: MOVIMIENTOS_CUENTAS_TIPO.ACREDITA,
          cantidad,
          usuario: usuario_destino,
          transaction,
        });

        await aumentarSaldoDeCuenta({ cuenta: cuenta_destino, cantidad, transaction });

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw new DesconocidoBDError();
      }

      return res.status(200).json({ mensaje: "compra autorizada" });
    } catch (error) {
      return res.status(404).json({ error });
    }
  },
};
