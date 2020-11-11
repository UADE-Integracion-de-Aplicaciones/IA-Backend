const { db } = require("../../src/sequelize/models");
const { clientes, cuentas, empleados, usuarios, roles, facturas } = db;

module.exports = {
    //Crea una transaccion / eposito de cuenta
    async registrar(nombre_usuario, clave, rol_id) {
        return await usuarios
            .create ({
                nombre_usuario:nombre_usuario,
                clave:clave,
                rol_id:rol_id
            })
    },

    //Movimientos de una cuenta
    async getUserByUserName(userName) {
        return await usuarios.findOne({
            where: { nombre_usuario: userName },
          })
    },
};