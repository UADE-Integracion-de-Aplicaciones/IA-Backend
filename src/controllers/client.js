const Sequelize = require('sequelize');
// const user = require('../sequelize/models').user;

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
    }
};