const { syncDb } = require("../sequelize/models");
const { cargarData } = require("../../tests/fixtures");

const execute = async () => {
  await syncDb();
  await cargarData();
};

execute();
