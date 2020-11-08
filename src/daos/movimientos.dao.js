const { db } = require("../sequelize/models");
const { clientes, cuentas, movimientos_cuentas } = db;

const depositarDinero = async (dni, cbu) => {
  const cliente = await clientes.findOne({ where: { dni } });
  if (cliente) {
  }
};

module.exports = { depositarDinero };
