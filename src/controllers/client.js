const Sequelize = require('sequelize');
const client = require('../sequelize/models').client;
const clientDao = require('../daos/client.dao');

module.exports = {
    async create(req, res) {
        const {tipo, cuit, dni,nombre, apellido, email, domicilio_ciudad, domicilio_calle, domicilio_barrio, domicilio_numero, domicilio_piso, apartamento, fecha_nacimiento, pregunta1, pregunta1_respuesta, pregunta2, pregunta2_respuesta, pregunta3, pregunta3_respuesta, usuario_id} = req.body;

        if (!req || !req.body) {
            res.status(300).send({message: "No existe payload"})
            return ;
        }

        if (!tipo || !cuit || !dni || !nombre || !apellido || !email|| ! domicilio_ciudad || !domicilio_calle || !domicilio_barrio || !fecha_nacimiento || !pregunta1 || !pregunta2 || !pregunta3 || !pregunta1_respuesta || !pregunta2_respuesta || !pregunta3_respuesta) {
            res.status(301).send({message: "Campos esenciales inexistentes o erroneos"})
            return ;
        }

        await clientDao.create(req.body)
            .then(client => res.status(200).send(client))
            .catch(error => res.status(400).send(error))
    },

    //Que campos se van a poder modificar?
    update(req, res) {
        await clientDao.update(req.body)
    },

    async delete(req, res) {
        await clientDao.delete(req.body)
        .then(() => res.status(200).send({message: "Se elimino el cliente correctamente"}))
        .catch(error => res.status(400).send(error))
    },

    async getClient(req, res) {
        res.status(200).send("get client")
    },
};