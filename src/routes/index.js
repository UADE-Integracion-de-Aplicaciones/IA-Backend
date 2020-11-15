const { cargarBDConDatosParaTest } = require("../../tests/fixtures");
const cargarNumerosUnicos = require("../tasks/crear_numero_unicos");

const cargarDataDePrueba = async (req, res) => {
  await cargarBDConDatosParaTest();
  await cargarNumerosUnicos();
  return res.status(200).json({ mensaje: "Ok!" });
};

module.exports = (app) => {
  app.get("/healthcheck", (req, res) => cargarDataDePrueba(req, res));
};
