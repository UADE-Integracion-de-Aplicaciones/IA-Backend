const { db } = require("../sequelize/models");
const { usuarios, roles } = db;

module.exports = {
  registrar({ nombre_usuario, clave, rol_id }) {
    return usuarios.create({
      nombre_usuario,
      clave,
      rol_id,
    });
  },

  buscarUsuarioPorNombreUsuario(nombre_usuario) {
    return usuarios.findOne({
      where: { nombre_usuario: nombre_usuario },
      include: {
        model: roles,
      },
    });
  },
};
