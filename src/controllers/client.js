const Sequelize = require('sequelize');
const client = require('../sequelize/models').client;

module.exports = {
    create(req, res) {
        return client
            .create ({})
            .then(client => res.status(200).send(client))
            .catch(error => res.status(400).send(error))
    },

    list(_, res) {
        return client.findAll({})
            .then(client => res.status(200).send(client))
            .catch(error => res.status(400).send(error))
    },

    modify(req, res) {
        //
        // logic
        //
        res.status(200).send("modify")
    },

    delete(req, res) {
        //
        // logic
        //
        res.status(200).send("delete")
    },

    getClient(req, res) {
        //
        // Deberiamos identificar si es CBU o DNI y de ahi buscar por dicho campo
        //
        res.status(200).send("get client")
    }
};