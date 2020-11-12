const { syncDb } = require("../sequelize/models");
const { cargarData } = require("../../tests/fixtures");

module.exports = async () => {
  await syncDb();
  await cargarData();
};
