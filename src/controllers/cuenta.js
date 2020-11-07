const Sequelize = require('sequelize');
const cuenta = require('../sequelize/models').cuenta;
const cuentaDao = require('../daos/cuenta.dao');

module.exports = {
    async create(req, res) {
        const {tipo, cliete_id, fondo_descubierto, saldo, empleado_creador_id} = req.body;

        if (!req || !req.body) {
            res.status(300).send({message: "No existe payload"})
            return ;
        }

        if (!tipo || !cliete_id || !fondo_descubierto || !saldo || !empleado_creador_id ) {
            res.status(301).send({message: "Campos esenciales inexistentes o erroneos"})
            return ;
        }

        await cuentaDao.create(req.body)
            .then(cuenta => res.status(200).send(cuenta))
            .catch(error => res.status(400).send(error))
    },

    //Que campos se van a poder modificar?
    update(req, res) {
        await cuentaDao.update(req.body)
    },

    async delete(req, res) {
        await cuentaDao.delete(req.body)
        .then(() => res.status(200).send({message: "Se elimino la cuenta correctamente"}))
        .catch(error => res.status(400).send(error))
    },

    async getCuenta(req, res) {
        await cuentaDao.getCuenta(req.body)
        .then(cuenta => res.status(200).send(cuenta))
        .catch(error => res.status(400).send(error))
    },
};