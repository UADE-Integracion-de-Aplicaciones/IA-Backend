const { db } = require("../sequelize/models");
const { MOVIMIENTOS_CUENTAS_TIPO, CONCEPTOS_MOVIMIENTOS } = require("./common");
const { clientes, cuentas, movimientos_cuentas, conceptos_movimientos } = db;

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

const depositarDineroEnCuenta = async (dni, cbu, usuario, cantidad) => {
  const cliente = await clientes.findOne({ where: { dni } });
  const cuenta = await buscarCuenta(cbu);

  if (!cliente) {
    console.log("el cliente no existe");
  }

  if (!cuenta) {
    console.log("la cuenta no existe");
  }

  const concepto = await conceptos_movimientos.findOne({
    where: { alias: CONCEPTOS_MOVIMIENTOS.DEPOSITO },
  });

  const transaction = await db.sequelize.transaction();

  try {
    const movimiento_acredita = await movimientos_cuentas.create(
      {
        cuenta_id: cuenta.get("id"),
        concepto_movimiento_id: concepto.get("id"),
        tipo: MOVIMIENTOS_CUENTAS_TIPO.ACREDITA,
        cantidad,
        usuario_creador_id: usuario.get("id"),
      },
      { transaction }
    );
    console.log(movimiento_acredita);

    await actualizarSaldoDeCuenta({ cuenta, cantidad, transaction });

    await transaction.commit();
  } catch (error) {
    console.log(error);
    await transaction.rollback();
  }
};

module.exports = { depositarDineroEnCuenta };
