const { syncDb } = require("../sequelize/models");
const { cargarData } = require("../../tests/fixtures");
const cargarNumerosUnicos = require("./crear_numero_unicos");

module.exports = async () => {
  console.log("Tarea de Cargar datos de Prueba");
  await syncDb(true, true);
  await cargarData();
  await cargarNumerosUnicos();
};
