const { db } = require("../sequelize/models");
const {
  buscarCuentasParaMantenimiento,
  cobrarComisionPorMantenimientoCuenta,
} = require("../daos/transacciones.dao");

const execute = async () => {
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

execute();
