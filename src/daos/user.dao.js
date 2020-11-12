const { db } = require("../../src/sequelize/models");
const { usuarios, roles } = db;

module.exports = {
  //Crea una transaccion / eposito de cuenta
  registrar({ nombre_usuario, clave, rol_id }) {
    return usuarios.create({
      nombre_usuario,
      clave,
      rol_id,
    });
  },

  //Movimientos de una cuenta
  getUserByUserName(userName) {
    return usuarios.findOne({
      where: { nombre_usuario: userName },
      include: {
        model: roles,
      },
    });
  },
};
