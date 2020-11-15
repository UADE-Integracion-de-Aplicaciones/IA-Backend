const { db } = require("../sequelize/models");
const { numeros_unicos } = db;
const { generarNumeroCuenta } = require("../daos/cuentas.dao");
const { NUMERO_UNICO_TIPO } = require("../daos/common");

module.exports = async () => {
  console.log("Tarea de Generar un lote de números de cuenta únicos");
  const limite = 20000;

  const numeros_cuentas = [];

  while (numeros_cuentas.length <= limite) {
    const numero = generarNumeroCuenta();
    numeros_cuentas.push(numero);
  }

  await numeros_unicos.bulkCreate(
    numeros_cuentas.map((numero) => ({
      numero,
      tipo: NUMERO_UNICO_TIPO.NUMERO_DE_CUENTA,
      tomado: false,
    }))
  );
};
