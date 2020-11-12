const { Sequelize } = require("sequelize");
const { Op } = Sequelize;
const {
  DEFAULTS,
  MOVIMIENTOS_CUENTAS_TIPO,
  MOVIMIENTOS_CUENTAS_CONCEPTO,
  CUENTAS_TIPO,
} = require("./common");
const {
  DesconocidoBDError,
  ClienteNoExisteError,
  CuentaNoExisteError,
  CantidadInvalidaError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
  CantidadMenorQueTotalFacturasError,
  CantidadMayorQueTotalFacturasError,
} = require("./errors");
const { db } = require("../sequelize/models");
const {
  clientes,
  cuentas,
  movimientos_cuentas,
  conceptos_movimientos,
  usuarios,
  parametros,
} = db;
const moment = require("moment");

const buscarCliente = (dni) => {
  return clientes.findOne({ where: { dni } });
};

const buscarCuentaPorCbu = (cbu) => {
  return cuentas.findOne({ where: { cbu } });
};

const buscarCuentaPorNumero = (numero_cuenta) => {
  return cuentas.findOne({ where: { numero_cuenta } });
};

const buscarConcepto = (alias) => {
  return conceptos_movimientos.findOne({
    where: { alias },
  });
};

const actualizarSaldoDeCuenta = ({
  cuenta,
  cantidad,
  operacion,
  transaction,
}) => {
  let saldo = parseFloat(cuenta.get("saldo"));
  if (operacion === MOVIMIENTOS_CUENTAS_TIPO.ACREDITA) {
    saldo += cantidad;
  } else {
    saldo -= cantidad;
  }

  return cuentas.update(
    {
      saldo,
    },
    {
      where: { id: cuenta.get("id") },
      transaction,
    }
  );
};

const aumentarSaldoDeCuenta = ({ cuenta, cantidad, transaction }) => {
  const operacion = MOVIMIENTOS_CUENTAS_TIPO.ACREDITA;
  return actualizarSaldoDeCuenta({ cuenta, cantidad, operacion, transaction });
};

const disminuirSaldoDeCuenta = ({ cuenta, cantidad, transaction }) => {
  const operacion = MOVIMIENTOS_CUENTAS_TIPO.DEBITA;
  return actualizarSaldoDeCuenta({ cuenta, cantidad, operacion, transaction });
};

const tieneSaldoEnCuentaParaPagar = ({ cuenta, cantidad }) => {
  if (cuenta.get("tipo") == CUENTAS_TIPO.CUENTA_CORRIENTE) {
    const saldo_real =
      parseFloat(cuenta.get("saldo")) +
      parseFloat(cuenta.get("fondo_descubierto"));
    return saldo_real < cantidad;
  } else if (cuenta.get("tipo") == CUENTAS_TIPO.CAJA_DE_AHORRO) {
    return parseFloat(cuenta.get("saldo")) < cantidad;
  }
};

const crearMovimiento = ({
  cuenta,
  concepto,
  tipo,
  usuario,
  cantidad,
  transaction,
}) => {
  console.log(cuenta, concepto, tipo, usuario, cantidad);
  return movimientos_cuentas.create(
    {
      cuenta_id: cuenta.get("id"),
      concepto_movimiento_id: concepto.get("id"),
      tipo,
      cantidad,
      usuario_creador_id: usuario.get("id"),
    },
    { transaction }
  );
};

const cobrarComisionPorTransaccion = async (movimiento, { transaction }) => {
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "system.admin.0" },
  });

  const parametro = await parametros.findOne({
    where: { parametro: "COMISION_TRANSACCION_PROVEEDOR" },
  });

  const concepto = await buscarConcepto("COMISION_POR_TRANSACCION");
  const tipo = MOVIMIENTOS_CUENTAS_TIPO.DEBITA;
  const cuenta = await movimiento.getCuenta();
  const cantidad =
    parseFloat(movimiento.get("cantidad")) * parseFloat(parametro.get("valor"));

  return crearMovimiento({
    cuenta,
    concepto,
    tipo,
    usuario,
    cantidad,
    transaction,
  });
};

const cobrarComisionPorMantenimientoCuenta = async (
  cuenta,
  { transaction }
) => {
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "system.admin.0" },
  });
  const parametro = await parametros.findOne({
    where: { parametro: "COMISION_MANTENIMIENTO_DE_CUENTA" },
  });
  const concepto = await buscarConcepto("MANTENIMIENTO_DE_CUENTA");
  const tipo = MOVIMIENTOS_CUENTAS_TIPO.DEBITA;
  const cantidad = parseFloat(parametro.get("valor"));

  return crearMovimiento({
    cuenta,
    concepto,
    tipo,
    usuario,
    cantidad,
    transaction,
  });
};

const buscarCuentasParaMantenimiento = () => {
  const { valor, unidad } = DEFAULTS.TIEMPO_MANTENIMIENTO_CUENTAS;
  return cuentas.findAll({
    where: {
      fecha_creacion: {
        [Op.gte]: moment().subtract(valor, unidad),
      },
    },
  });
};

const depositarEnCuentaPropia = (numero_cuenta) => async ({
  dni,
  usuario,
  cantidad,
}) => {
  const cliente = await buscarCliente(dni);

  if (!cliente) {
    throw new ClienteNoExisteError();
  }

  const cuenta = await buscarCuentaPorNumero(numero_cuenta);

  if (!cuenta) {
    throw new CuentaNoExisteError();
  }

  return depositarDineroEnCuenta({ cuenta, usuario, cantidad });
};

const depositarEnCuentaDeTercero = (cbu) => async ({
  dni,
  usuario,
  cantidad,
}) => {
  const cuenta = await buscarCuentaPorCbu(cbu);

  if (!cuenta) {
    throw new CuentaNoExisteError();
  }

  return depositarDineroEnCuenta({ cuenta, usuario, cantidad });
};

const depositarDineroEnCuenta = async ({ cuenta, usuario, cantidad }) => {
  if (cantidad <= 0) {
    throw new CantidadInvalidaError();
  }

  const concepto = await buscarConcepto(MOVIMIENTOS_CUENTAS_CONCEPTO.DEPOSITO);
  const tipo = MOVIMIENTOS_CUENTAS_TIPO.ACREDITA;
  const transaction = await db.sequelize.transaction();

  try {
    const movimiento = await crearMovimiento({
      cuenta,
      concepto,
      tipo,
      cantidad,
      usuario,
      transaction,
    });

    await aumentarSaldoDeCuenta({ cuenta, cantidad, transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new DesconocidoBDError();
  }
};

const extraerDineroDeCuenta = async ({
  numero_cuenta,
  dni,
  cantidad,
  usuario,
}) => {
  if (cantidad <= 0) {
    throw new CantidadInvalidaError();
  }

  const cliente = await buscarCliente(dni);
  const cuenta = await buscarCuentaPorNumero(numero_cuenta);

  if (!cuenta) {
    throw new CuentaNoExisteError();
  }

  if (!cliente) {
    throw new ClienteNoExisteError();
  }

  if (cuenta.get("cliente_id") !== cliente.get("id")) {
    throw new CuentaNoAsociadaAlClienteError();
  }

  if (tieneSaldoEnCuentaParaPagar({ cuenta, cantidad })) {
    throw new CuentaConSaldoInsuficienteError();
  }

  const concepto = await buscarConcepto(
    MOVIMIENTOS_CUENTAS_CONCEPTO.EXTRACCION
  );
  const tipo = MOVIMIENTOS_CUENTAS_TIPO.DEBITA;
  const transaction = await db.sequelize.transaction();

  try {
    const movimiento = await crearMovimiento({
      cuenta,
      concepto,
      tipo,
      cantidad,
      usuario,
      transaction,
    });

    await disminuirSaldoDeCuenta({ cuenta, cantidad, transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new DesconocidoBDError();
  }
};

const pagarServicio = async ({
  facturas,
  cuenta,
  cantidad,
  usuario_debita,
  usuario_acredita,
}) => {
  const cuenta_origen = cuenta;
  if (tieneSaldoEnCuentaParaPagar({ cuenta: cuenta_origen, cantidad })) {
    throw new CuentaConSaldoInsuficienteError();
  }

  const importeTotal = facturas.reduce(
    (suma, factura) => suma + parseFloat(factura.get("importe")),
    0.0
  );
  if (cantidad < importeTotal) {
    throw new CantidadMenorQueTotalFacturasError();
  } else if (cantidad > importeTotal) {
    throw new CantidadMayorQueTotalFacturasError();
  }

  //TODO: validar si hay alguna factura vencida
  //TODO: validar que las facturas no hayan sido pagadas anteriormente

  const cuenta_destino = await facturas[0].getCuenta();

  const concepto_pago_proveedor = await buscarConcepto(
    MOVIMIENTOS_CUENTAS_CONCEPTO.PAGO_A_PROVEEDOR
  );
  const concepto_pago_cliente = await buscarConcepto(
    MOVIMIENTOS_CUENTAS_CONCEPTO.PAGO_DE_CLIENTE
  );
  const transaction = await db.sequelize.transaction();

  try {
    await crearMovimiento({
      cuenta: cuenta_origen,
      concepto: concepto_pago_proveedor,
      tipo: MOVIMIENTOS_CUENTAS_TIPO.DEBITA,
      cantidad,
      usuario: usuario_debita,
      transaction,
    });

    await actualizarSaldoDeCuenta({
      cuenta: cuenta_origen,
      cantidad,
      operacion: MOVIMIENTOS_CUENTAS_TIPO.DEBITA,
      transaction,
    });

    const movimiento = await crearMovimiento({
      cuenta: cuenta_destino,
      concepto: concepto_pago_cliente,
      tipo: MOVIMIENTOS_CUENTAS_TIPO.ACREDITA,
      cantidad,
      usuario: usuario_acredita,
      transaction,
    });

    const comision = await cobrarComisionPorTransaccion(movimiento, {
      transaction,
    });

    await actualizarSaldoDeCuenta({
      cuenta: cuenta_destino,
      cantidad: cantidad - parseFloat(comision.get("cantidad")),
      operacion: MOVIMIENTOS_CUENTAS_TIPO.ACREDITA,
      transaction,
    });

    const facturasUpdatePromises = facturas.map((fact) =>
      fact.update({ fecha_pagado: new Date() }, { transaction })
    );
    await Promise.all(facturasUpdatePromises);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new DesconocidoBDError();
  }
};

const pagarServicioComoCliente = async ({
  numero_cuenta,
  facturas,
  cantidad,
  usuario,
}) => {
  if (cantidad <= 0) {
    throw new CantidadInvalidaError();
  }

  const cuenta = await buscarCuentaPorNumero(numero_cuenta);
  if (!cuenta) {
    throw new CuentaNoExisteError();
  }

  const usuario_debita = usuario;
  const usuario_acredita = usuario;

  await pagarServicio({
    facturas,
    cuenta,
    cantidad,
    usuario_debita,
    usuario_acredita,
  });
};

const pagarServicioComoBanco = (dni) => async ({
  numero_cuenta,
  facturas,
  cantidad,
  usuario,
}) => {
  if (cantidad <= 0) {
    throw new CantidadInvalidaError();
  }

  const cuenta = await buscarCuentaPorNumero(numero_cuenta);
  if (!cuenta) {
    throw new CuentaNoExisteError();
  }

  const cliente = await buscarCliente(dni);
  if (!cliente) {
    throw new ClienteNoExisteError();
  } else if (cuenta.get("cliente_id") !== cliente.get("id")) {
    throw new CuentaNoAsociadaAlClienteError();
  }

  const usuario_debita = usuario;
  const usuario_acredita = await cliente.getUsuario();

  await pagarServicio({
    facturas,
    cuenta,
    cantidad,
    usuario_debita,
    usuario_acredita,
  });
};

module.exports = {
  extraerDineroDeCuenta,
  depositarEnCuentaPropia,
  depositarEnCuentaDeTercero,
  pagarServicioComoCliente,
  pagarServicioComoBanco,
  cobrarComisionPorMantenimientoCuenta,
  buscarCuentasParaMantenimiento,
};
