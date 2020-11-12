const { db } = require("../sequelize/models");
const {
  buscarCuentasConFondoDescubierto,
  cobrarInteresPorFondoDescubierto,
} = require("../daos/transacciones.dao");

module.exports = async () => {
  console.log("Tarea de Cobro de Interés por Fondo Descubierto");
  const cuentas = await buscarCuentasConFondoDescubierto();

  const transaction = await db.sequelize.transaction();
  const promises = cuentas.map((c) =>
    cobrarInteresPorFondoDescubierto(c, { transaction })
  );

  try {
    await Promise.all(promises);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
};
