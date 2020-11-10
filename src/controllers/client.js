const moment = require('moment');
const clientsDao = require('../daos/client.dao');

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

    modify(req, res) {
        //
        // logic
        //
        res.status(200).send("modify")
    },

    async delete(req, res) {
        const { id } = req.query

        if (!id) {
            res.status(301).send("Parametros inexistentes o incompatibles.")
            return ;
        }

        const cliente = await clientsDao.buscarCliente("id", id)

        if (cliente) {
            if (cliente.id) {
                clientsDao.delete(cliente)
                res.status(200).send("El cliente se ha eliminado con exito")
            } 
            else 
                res.status(300).send("No se pudo encontrar un cliente.")
            return ;
        } else {
            res.status(400).send("El cliente no existe")
        }
    },

    async buscarCliente(req, res) {
        const {cuit, dni, id} = req.query
        let tipo = ""
        let valor = ""

        if (cuit) { tipo = "cuit"; valor = cuit } 
        else if (dni) { tipo = "dni"; valor = dni }
        else if (id) { tipo = "id"; valor = id} 
        else {
            res.status(301).send("Parametros inexistentes o incompatibles.")
            return ;
        }
        const cliente = await clientsDao.buscarCliente(tipo, valor)

        if (cliente) {
            if (cliente.id)
                res.status(200).send(cliente)
            else
                res.status(300).send("No se pudo encontrar un cliente.")

            return ;
        } else {
            res.status(400).send("Ocurrio un problema al buscar el cliente")
        }
    }
};