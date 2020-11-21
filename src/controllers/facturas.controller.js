const {
  cargarFacturas,
  obtenerFacturasPorCodigoPagoElectronico,
} = require("../daos/facturas.dao");

const { FacturaNoExisteError } = require("../daos/errors");

module.exports = {
  async cargar(req, res) {
    const { path } = req.file;
    const { numero_cuenta } = req.body;
    var columns = true;

    try {
      await cargarFacturas(path, numero_cuenta, columns);
      return res.status(200).json({ mensaje: "Facturas cargadas" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ mensaje: err });
    }
  },

  async obtenerFacturas(req, res) {
    const { params } = req;
    const { codigo_pago_electronico } = params;

    try {
      const facturas = await obtenerFacturasPorCodigoPagoElectronico(
        codigo_pago_electronico
      );
      if (facturas.length == 0) {
        throw new FacturasNoExistenError();
      }

      const respuesta = facturas.map((factura) => ({
        codigo_pago_electronico: factura.get("codigo_pago_electronico"),
        numero_factura: factura.get("numero_factura"),
        importe: factura.get("importe"),
        fecha_vencimiento: factura.get("fecha_vencimiento"),
        fecha_pagado: factura.get("fecha_pagado"),
      }));
      return res.status(200).json({ facturas: respuesta });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },
};
