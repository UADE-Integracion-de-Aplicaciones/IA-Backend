const {
  MOVIMIENTOS_CUENTAS_TIPO,
  MOVIMIENTOS_CUENTAS_CONCEPTO,
} = require("./common");
const { ClienteNoExisteError, CuentaNoExisteError } = require("./errors");
const { db } = require("../sequelize/models");
const { clientes, cuentas, movimientos_cuentas, conceptos_movimientos } = db;

const buscarCliente = (dni) => {
  return clientes.findOne({ where: { dni } });
};

const buscarCuenta = (cbu) => {
  return cuentas.findOne({ where: { cbu } });
};

const actualizarSaldoDeCuenta = ({ cuenta, cantidad, transaction }) => {
  return cuentas.update(
    {
      saldo: parseFloat(cuenta.get("saldo")) + cantidad,
    },
    {
      where: { id: cuenta.get("id") },
      transaction,
    }
  );
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

const depositarDineroEnCuenta = async ({ dni, cbu, usuario, cantidad }) => {
  const cliente = await buscarCliente(dni);
  const cuenta = await buscarCuenta(cbu);

  if (!cliente) {
    throw new ClienteNoExisteError();
  }

  if (!cuenta) {
    throw new CuentaNoExisteError();
  }

  const concepto = await conceptos_movimientos.findOne({
    where: { alias: MOVIMIENTOS_CUENTAS_CONCEPTO.DEPOSITO },
  });

  const transaction = await db.sequelize.transaction();

  try {
    const movimiento_acredita = await crearMovimiento({
      cuenta,
      concepto,
      tipo: MOVIMIENTOS_CUENTAS_TIPO.ACREDITA,
      cantidad,
      usuario,
      transaction,
    });

    await actualizarSaldoDeCuenta({ cuenta, cantidad, transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
};

module.exports = { depositarDineroEnCuenta };
