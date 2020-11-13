const { Sequelize } = require("sequelize");
const { db } = require("../sequelize/models");
const { facturas, cuentas } = db;
const csv = require("csv-parser");
const fs = require("fs");
const {
  CuentaNoExisteError,
  ArchivoVacio,
  FacturaNoExisteError,
  CodigoPagoElectronicoNoExisteError,
} = require("./errors");

const buscarFacturasPorCodigo = (codigo_pago_electronico) => {
  return facturas.findAll({ where: { codigo_pago_electronico } });
};

const buscarFacturaPorNumeroFactura = (numero_factura) => {
  return facturas.findOne({ where: { numero_factura } });
};

const buscarFacturasPorIds = (ids) => {
  return facturas.findAll({ where: { id: { [Sequelize.Op.in]: ids } } });
};

const cargarFacturas = async (sourceFilePath, numero_cuenta, columns) => {
  const cuenta = await cuentas.findOne({
    where: {
      numero_cuenta,
    },
  });

  console.log(cuenta);

  if (!cuenta) {
    throw new CuentaNoExisteError();
  }

  var source = fs.createReadStream(sourceFilePath);

  if (!source) {
    throw new ArchivoVacio();
  }

  var linesRead = 0;

  var parser = csv({
    delimiter: ",",
    columns: columns,
  });

  parser.on("readable", function() {
    var record;
    while ((record = parser.read())) {
      linesRead++;
      crear({ ...record, cuenta });
    }
  });

  parser.on("error", function(error) {
    console.log("Error");
  });

  source.pipe(parser);
};

const crear = async ({
  codigo_pago_electronico,
  numero_factura,
  importe,
  fecha_vencimiento,
  cuenta,
}) => {
  const cuenta_id = cuenta.get("id");
  return await facturas.create({
    codigo_pago_electronico,
    numero_factura,
    importe,
    fecha_vencimiento,
    cuenta_id,
  });
};

module.exports = {
  crear,
  cargarFacturas,
  buscarFacturasPorCodigo,
  buscarFacturaPorNumeroFactura,
  buscarFacturasPorIds,

  async getFactura(payload) {
    const factura = buscarFactura(payload);
    if (!factura) {
      return factura;
    } else {
      throw new FacturaNoExisteError();
    }
  },

  buscarFactura(payload) {
    if (payload.codigo_pago_electronico)
      return getFacturaByCodigoPagoElectronico(payload.codigo_pago_electronico);
    else if (payload.numero_factura)
      return getFacturaByNumeroFactura(payload.numero_factura);
    throw Error("No se encontro un campo valido");
  },

  async getFacturaByCodigoPagoElectronico(codigo_pago_electronico) {
    const codigo = facturas.findOne({
      where: { codigo_pago_electronico: codigo_pago_electronico },
    });
    if (!codigo) {
      return codigo;
    } else {
      throw new CodigoPagoElectronicoNoExisteError();
    }
  },

  getFacturaByNumeroFactura(numero_factura) {
    const numero = facturas.findOne({ where: { numero_factura } });
    if (!numero) {
      return numero;
    } else {
      throw new NumeroFacturaNoExisteError();
    }
  },
};
