const Sequelize = require('sequelize');
const user = require('../sequelize/models/').db.usuarios

module.exports = {
    //Crea una transaccion / eposito de cuenta
    async registrar(nombre_usuario, clave, rol_id) {
        return await user
            .create ({
                nombre_usuario:nombre_usuario,
                clave:clave,
                rol_id:rol_id
            })
    },

    //Movimientos de una cuenta
    async getUserByUserName(userName) {
        return await user.findOne({ where: { nombre_usuario: userName } })
    },
};