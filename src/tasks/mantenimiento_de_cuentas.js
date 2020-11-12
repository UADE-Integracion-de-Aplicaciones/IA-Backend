const { db } = require("../sequelize/models");
const {
  buscarCuentasParaMantenimiento,
  cobrarComisionPorMantenimientoCuenta,
} = require("../daos/transacciones.dao");

module.exports = async () => {
  console.log("Tarea de Cobro por Mantenimiento de Cuentas");
  const cuentas = await buscarCuentasParaMantenimiento();

  const transaction = await db.sequelize.transaction();
  const cobrarPromises = cuentas.map((c) =>
    cobrarComisionPorMantenimientoCuenta(c, { transaction })
  );

  try {
    await Promise.all(cobrarPromises);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
};
