const {
  MOVIMIENTOS_CUENTAS_TIPO,
  MOVIMIENTOS_CUENTAS_CONCEPTO,
  CUENTAS_TIPO,
} = require("./common");
const {
  ClienteNoExisteError,
  CuentaNoExisteError,
  CantidadInvalidaError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
} = require("./errors");
const { db } = require("../sequelize/models");
const { clientes, cuentas, movimientos_cuentas, conceptos_movimientos } = db;

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

const crearMovimiento = ({
  cuenta,
  concepto,
  tipo,
  usuario,
  cantidad,
  transaction,
}) => {
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

  if (cuenta.get("tipo") == CUENTAS_TIPO.CUENTA_CORRIENTE) {
    const saldo_real =
      parseFloat(cuenta.get("saldo")) +
      parseFloat(cuenta.get("fondo_descubierto"));
    if (saldo_real < cantidad) {
      throw new CuentaConSaldoInsuficienteError();
    }
  } else if (cuenta.get("tipo") == CUENTAS_TIPO.CAJA_DE_AHORRO) {
    if (cuenta.get("saldo") < cantidad) {
      throw new CuentaConSaldoInsuficienteError();
    }
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
  }
};

module.exports = {
  extraerDineroDeCuenta,
  depositarEnCuentaPropia,
  depositarEnCuentaDeTercero,
};
