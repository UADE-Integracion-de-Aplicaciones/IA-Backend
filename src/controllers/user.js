const Sequelize = require('sequelize');
// const user = require('../sequelize/models').user;

module.exports = {
    create(req, res) {
        return user
            .create ({})
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send(error))
    },

    list(_, res) {
        return user.findAll({})
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send(error))
    },
};