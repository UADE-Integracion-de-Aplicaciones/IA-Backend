const { db } = require("../sequelize/models");
const { MOVIMIENTOS_CUENTAS_TIPO } = require("./common");
const { clientes, cuentas, movimientos_cuentas } = db;

const depositarDinero = async (dni, cbu, cantidad) => {
  const cliente = await clientes.findOne({ where: { dni } });
  const cuenta = await cuentas.findOne({ where: { cbu } });
  if (!cliente) {
    console.log("el cliente no existe o se encuentra inactivo");
  }

  if (!cuenta) {
    console.log("la cuenta no existe");
  }
  if (cliente.get("id") == cuenta.get("cliente_id")) {
    console.log("la cuenta es del mismo cliente");
  } else {
    console.log("la cuenta es de un tercer cliente");
  }
};

module.exports = { depositarDinero };
