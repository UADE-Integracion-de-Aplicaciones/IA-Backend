const moment = require('moment');
const clientesDao = require('../daos/clientes.dao');
const clientsDao = require('../daos/clientes.dao');

module.exports = {
    create(req, res) {
        const {tipo, cuit, dni, nombre, apellido, email, domicilio_barrio, domicilio_calle, domicilio_ciudad, domicilio_numero, domicilio_piso, domicilio_apartamento, fecha_nacimiento, pregunta1,pregunta1_respuesta, pregunta2, pregunta2_respuesta, pregunta3, pregunta3_respuesta, usuario_id} = req.query;
        var fechaNacimiento = moment(fecha_nacimiento).format('YYYY-MM-DD');
        clientsDao.crear(tipo, cuit, dni, nombre, apellido, email, domicilio_barrio, domicilio_calle, domicilio_ciudad, domicilio_numero, domicilio_piso, domicilio_apartamento, fechaNacimiento, pregunta1,pregunta1_respuesta, pregunta2, pregunta2_respuesta, pregunta3, pregunta3_respuesta, usuario_id)
            .then(cliente => {           
                if (!cliente) {
                    res.status(401).send("Ocurrio un error en la creacion del cliente")
                    return ;
                }     
                res.status(200).send(cliente)
                return cliente
            })
            .catch(error => {
                console.log(error)
                res.status(400).send("Ocurrio algo en la creacion del cliente")
            })
    },

    verificarCliente(req, res) {
        const { id } = req.query
        if (!id) {
            res.status(301).send("Llamada faltante de datos")
            return ;
        }

        clientsDao.buscarPorId(id)
            .then(cliente => {
                if (!cliente || cliente === undefined || cliente === null) {
                    res.status(300).send("Cliente no encontrado")
                    return ;
                }

                //TODO Falta cliente si esta activo

            })
            .catch(error => {
                console.log(error)
                res.status(400).send("Error inesperado en al busceda por id de cliente")
            })
    },

    //Que campos se van a poder modificar?
    /*update(req, res) {
        await clientDao.update(req.body)
    },
*/
    async delete(req, res) {
        await clientDao.delete(req.body)
        .then(() => res.status(200).send({message: "Se elimino el cliente correctamente"}))
        .catch(error => res.status(400).send(error))
    },

    async getClient(req, res) {
        res.status(200).send("get client")
    },
};