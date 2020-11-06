const Sequelize = require('sequelize');
const client = require('../sequelize/models').client;

module.exports = {
    async create(payload) {
        const {tipo, cuit, dni,nombre, apellido, email, domicilio_ciudad, domicilio_calle, domicilio_barrio, domicilio_numero, domicilio_piso, apartamento, fecha_nacimiento, pregunta1, pregunta1_respuesta, pregunta2, pregunta2_respuesta, pregunta3, pregunta3_respuesta, usuario_id} = payload;

        return await client.create ({
            tipo: tipo, cuit: cuit, dni: dni,nombre: nombre, apellido: apellido, email: email, domicilio_ciudad: domicilio_ciudad, domicilio_calle: domicilio_calle, domicilio_barrio: domicilio_barrio, domicilio_numero: domicilio_numero, domicilio_piso: domicilio_piso, apartamento: apartamento, fecha_nacimiento: fecha_nacimiento, pregunta1: pregunta1, pregunta1_respuesta: pregunta1_respuesta, pregunta2: pregunta2, pregunta2_respuesta: pregunta2_respuesta, pregunta3: pregunta3, pregunta3_respuesta: pregunta3_respuesta, usuario_id: usuario_id
        })
    },

    //TODO
    //Que campos se van a poder modificar?
    update(payload) {
        const cliente = await this.buscarCliente(payload);
    },

    async delete(req, res) {
        const cliente = this.buscarCliente(payload);
        return await cliente.destroy();
    },

    //TODO
    async getClient(req, res) {
        // await
    },

    //Recibe el payload (body del req) y chequea si tiene cuit o dni
    buscarCliente(payload) {
        if (payload.cuit)
            return this.getClienteByCuit(payload.cuit)
        else if (payload.dni)
            return this.getClienteByDni(payload.dni)
        else if (payload.id)
            return this.getClienteById(payload.id)
        throw Error("No se encontro un campo valido")
    },

    getClienteById(id) {
        return client.findOne({
            where: {
                id: id
            }
        })
    },    

    getClienteByDni(dni) {
        return client.findOne({
            where: {
                dni: dni
            }
        })
    },

    getClienteByCuit(cuit) {
        return client.findOne({
            where: {
                cuit: cuit
            }
        })
    },
};