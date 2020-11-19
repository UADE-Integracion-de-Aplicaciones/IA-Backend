const { Sequelize, Op } = require("sequelize");
const { db } = require("../sequelize/models");
const { facturas, cuentas } = db;
const csv = require("csv-parser");
const fs = require("fs");
const {
  CuentaNoExisteError,
  ArchivoVacioError,
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

const obtenerFacturasFechaCuenta = async (numero_cuenta, anio, mes) => {
  const cuenta = await cuentas.findOne({ where: { numero_cuenta } });
  
  const fechaInicio = moment().year(anio).month(mes).toDate();
  const fechaFin = moment().year(anio).month(mes).add(1, 'M').toDate();
  return facturas.findAll({
    where: {
      cuenta_id: cuenta.get("id"),
      fecha_vencimiento: {
        [Op.between]: [fechaInicio, fechaFin]
      }
    }
  })
}

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
    throw new ArchivoVacioError();
  }

  var linesRead = 0;

  var parser = csv({
    delimiter: ";",
    columns: columns,
  });

  parser.on("readable", function() {
    var record;
    while ((record = parser.read())) {
      console.log(record);
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
  obtenerFacturasFechaCuenta,

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

  obtenerFacturasPorCodigoPagoElectronico(codigo_pago_electronico) {
    return facturas.findAll({
      where: { codigo_pago_electronico },
    });
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
