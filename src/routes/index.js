const { cargarBDConDatosParaTest } = require("../../tests/fixtures");

const cargarDataDePrueba = async (req, res) => {
  await cargarBDConDatosParaTest();
  return res.status(200).json({ mensaje: "Ok!" });
};

module.exports = (app) => {
  app.get("/healthcheck", (req, res) => cargarDataDePrueba(req, res));
};
