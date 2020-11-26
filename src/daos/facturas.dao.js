const { Sequelize, Op } = require("sequelize");
const { db } = require("../sequelize/models");
const { facturas, cuentas } = db;
const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");
const {
  CuentaNoExisteError,
  ArchivoConFormatoInvalidoError,
  FacturaNoExisteError,
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

  const anioInt = parseInt(anio)
  const mesInt = parseInt(mes) - 2
  console.log("Anio int: " + anioInt, "mes int: " + mesInt)
  const fechaInicio = moment()
    .year(anioInt)
    .month(mesInt)
    .day(0)
    .toDate();
  const fechaFin = moment()
    .year(anioInt)
    .month(mesInt)
    .day(0)
    .add(1, "M")
    .toDate();
  console.log(fechaInicio, fechaFin)
  return facturas.findAll({
    where: {
      cuenta_id: cuenta.get("id"),
      fecha_vencimiento: {
        [Op.between]: [fechaInicio, fechaFin],
      },
    },
  });
};
const leerArchivoCsv = ({ sourceFilePath, separator, columns }) => {
  const filas = [];
  const parser = csv({
    separator,
    columns,
  });
  const stream = fs.createReadStream(sourceFilePath).pipe(parser);

  return new Promise((resolve, reject) => {
    stream.on("data", (data) => {
      filas.push(data);
    });
    stream.on("error", reject);
    stream.on("finish", () => resolve(filas));
  });
};

const cargarFacturas = async (sourceFilePath, numero_cuenta, columns) => {
  const cuenta = await cuentas.findOne({
    where: {
      numero_cuenta,
    },
  });

  if (!cuenta) {
    throw new CuentaNoExisteError();
  }

  const filas = await leerArchivoCsv({
    sourceFilePath,
    separator: ";",
    columns,
  });

  const facturasPorCrear = filas.map((fila) => {
    const fecha_vencimiento = moment(
      fila.fecha_vencimiento,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD");

    const valores = {
      ...fila,
      fecha_vencimiento,
      cuenta,
    };

    return crear(valores);
  });

  try {
    await Promise.all(facturasPorCrear);
  } catch (error) {
    console.log(error);
    throw new ArchivoConFormatoInvalidoError();
  }
};

const crear = ({
  codigo_pago_electronico,
  numero_factura,
  importe,
  fecha_vencimiento,
  cuenta,
}) => {
  //TODO: validar que el número de factura sea único
  const cuenta_id = cuenta.get("id");
  return facturas.create({
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
