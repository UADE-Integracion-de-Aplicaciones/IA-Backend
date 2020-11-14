const { db } = require("../sequelize/models");
const { empleados } = db;

const buscarEmpleadoPorUsuario = (usuario) => {
  const usuario_id = usuario.get("id");
  return empleados.findOne({ where: { usuario_id } });
};

module.exports = { buscarEmpleadoPorUsuario };
