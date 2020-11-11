const { Sequelize } = require("sequelize");
const { db } = require("../sequelize/models");
const { facturas } = db;

const buscarFacturasPorCodigo = (codigo_pago_electronico) => {
  return facturas.findAll({ where: { codigo_pago_electronico } });
};

const buscarFacturaPorNumeroFactura = (numero_factura) => {
  return facturas.findOne({ where: { numero_factura } });
};

const buscarFacturasPorIds = (ids) => {
  return facturas.findAll({ where: { id: { [Sequelize.Op.in]: ids } } });
};

module.exports = {
  buscarFacturasPorCodigo,
  buscarFacturaPorNumeroFactura,
  buscarFacturasPorIds,
};
