const {
  cargarFacturas,
  obtenerFacturasPorCodigoPagoElectronico,
  obtenerFacturasFechaCuenta
} = require("../daos/facturas.dao");

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

      const respuesta = facturas.map((factura) => ({
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

  async obtenerFacturasFecha(req, res) {
    const { params } = req;
    const { numero_cuenta, anio, mes } = params;

    try {
      const facturas = await obtenerFacturasFechaCuenta(numero_cuenta, anio, mes);

      const respuesta = facturas.map((factura) => ({
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
