const { db } = require("../sequelize/models");
const { roles } = db;
const { ParametrosFaltantesError } = require("./errors");
const { CLIENTES_TIPO } = require("./common");

const obtenerRolParaCliente = (cliente) => {
  if (!cliente) throw new ParametrosFaltantesError();

  if (cliente.get("tipo") == CLIENTES_TIPO.PERSONA_FISICA) {
    return roles.findOne({ where: { alias: "CLIENTE_PERSONA_FISICA" } });
  }

  if (cliente.get("tipo") == CLIENTES_TIPO.EMPRESA) {
    return roles.findOne({ where: { alias: "CLIENTE_EMPRESA" } });
  }

  if (cliente.get("tipo") == CLIENTES_TIPO.PROVEEDOR) {
    return roles.findOne({ where: { alias: "CLIENTE_PROVEEDOR" } });
  }
};

module.exports = {
  obtenerRolParaCliente,
};
