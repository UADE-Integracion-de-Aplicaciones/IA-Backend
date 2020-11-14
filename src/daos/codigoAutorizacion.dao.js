const moment = require("moment");
const { db } = require("../sequelize/models");
const { codigos_autorizacion, Sequelize } = db;
const { Op } = Sequelize;
const { CodigoDeAutorizacionInvalidoError } = require("./errors");

const LONGITUD_CCODIGO = 6;
const DIAS_VIGENCIA = 2;

const crearCodigo = async (cliente_id, codigo, fechaExpiracion) => {
  return await codigos_autorizacion.create({
    cliente_id: cliente_id,
    codigo: codigo,
    fecha_expiracion: fechaExpiracion,
    dias_vigencia: DIAS_VIGENCIA,
    usado: false,
  });
};

const nuevoCodigo = (longitud) => {
  var codigo = "";
  var caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var longitudCaracteres = caracteres.length;
  for (var i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * longitudCaracteres));
  }
  return codigo;
};

const validarCodigoAutorizacion = async ({ cliente, codigo }) => {
  if (!cliente || !codigo) throw new ParametrosFaltantesError();

  const cliente_id = cliente.get("id");
  const codigo_autorizacion = await codigos_autorizacion.findOne({
    where: {
      codigo,
      cliente_id,
      usado: false,
      fecha_expiracion: {
        [Op.gte]: moment(),
      },
    },
  });
  console.log(codigo_autorizacion);

  if (!codigo_autorizacion) {
    throw new CodigoDeAutorizacionInvalidoError();
  }

  return codigo_autorizacion;
};

module.exports = {
  validarCodigoAutorizacion,

  async generarCodigo(cliente_id) {
    const codigo = nuevoCodigo(LONGITUD_CCODIGO);
    const fechaExpiracion = moment()
      .add(DIAS_VIGENCIA, "days")
      .format("YYYY-MM-DD");
    return await crearCodigo(cliente_id, codigo, fechaExpiracion);
  },

  async buscarPorClienteId(cliente_id) {
    return await codigos_autorizacion
      .findAll({
        limit: 1,
        where: { cliente_id: cliente_id },
        order: [["fecha_creacion", "DESC"]],
      })
      .then((entries) => entries[0]);
  },

  margarCodigoComoUsado(codigo_autorizacion) {
    const id = codigo_autorizacion.get("id");
    return codigos_autorizacion.update({ usado: true }, { where: { id } });
  },
};
