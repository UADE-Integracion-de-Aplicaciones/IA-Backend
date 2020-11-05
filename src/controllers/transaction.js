const Sequelize = require('sequelize');
// const user = require('../sequelize/models').user;

module.exports = {
    //Crea una transaccion / eposito de cuenta
    create(req, res) {
        return transaction
            .create ({})
            .then(transaction => res.status(200).send(transaction))
            .catch(error => res.status(400).send(error))
    },

    //Movimientos de una cuenta
    getMovimientos(req, res) {
        //
        // logic
        //
        res.status(200).send("get movimientos")
    },
};