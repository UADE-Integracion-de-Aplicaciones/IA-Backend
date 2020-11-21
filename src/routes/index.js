const { cargarBDConDatosParaTest } = require("../../tests/fixtures");
const cargarNumerosUnicos = require("../tasks/crear_numero_unicos");
const darAltaClientesPorIntegracion = require("../tasks/dar_alta_clientes_integraciones");

const cargarDataDePrueba = async (req, res) => {
  await cargarBDConDatosParaTest();
  await cargarNumerosUnicos();
  await darAltaClientesPorIntegracion();
  return res.status(200).json({ mensaje: "Ok!" });
};

module.exports = (app) => {
  app.get("/healthcheck", (req, res) => cargarDataDePrueba(req, res));
};
