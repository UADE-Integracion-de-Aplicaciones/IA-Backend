const Sequelize = require('sequelize');
const user = require('../sequelize/models').usuarios;

module.exports = {
    //Crea una transaccion / eposito de cuenta
    async registrar(payload) {
        return transaction
            .create ({
                nombreUsuario: payload.nombreUsuario,
                clave: payload.clave
            })
            .then(transaction => res.status(200).send(transaction))
            .catch(error => res.status(400).send(error))
    },

    //Movimientos de una cuenta
    async getUserByUserName(userName) {
        return await user.findOne({ where: { nombreUsuario: userName } })
    },
};