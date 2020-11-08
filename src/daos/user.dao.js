const Sequelize = require('sequelize');
const user = require('../sequelize/models/').db.usuarios

module.exports = {
    //Crea una transaccion / eposito de cuenta
    async registrar(payload) {

        return await user
            .create ({
                nombreUsuario: payload.nombreUsuario,
                clave: payload.clave,
            })
    },

    //Movimientos de una cuenta
    async getUserByUserName(userName) {
        return await user.findOne({ where: { nombreUsuario: userName } })
    },
};