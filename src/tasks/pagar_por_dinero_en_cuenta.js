const { db } = require("../sequelize/models");
const {
  buscarCajasDeAhorroConSaldo,
  pagarInteresPorDineroEnCuenta,
} = require("../daos/transacciones.dao");

module.exports = async () => {
  console.log("Tarea de Pagar Interes Por Dinero En Cuenta");
  const cuentas = await buscarCajasDeAhorroConSaldo();

  const transaction = await db.sequelize.transaction();
  const promises = cuentas.map((c) =>
    pagarInteresPorDineroEnCuenta(c, { transaction })
  );

  try {
    await Promise.all(promises);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
};
