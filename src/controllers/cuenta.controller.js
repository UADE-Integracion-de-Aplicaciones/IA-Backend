const cuentaDao = require('../daos/cuenta.dao');

module.exports = {
    async create(req, res) {
        const {tipo, cliente_id, fondo_descubierto, saldo, empleado_creador_id} = req.body;

        if (!req || !req.body) {
            res.status(300).send({message: "No existe payload"})
            return ;
        }

        if (!tipo || !cliente_id || !fondo_descubierto || !saldo || !empleado_creador_id ) {
            res.status(301).send({message: "Campos esenciales inexistentes o erroneos"})
            return ;
        }

        await cuentaDao.create(req.body)
            .then(cuenta => res.status(200).send(cuenta))
            .catch(error => res.status(400).send(error))
    },

    //Que campos se van a poder modificar?
    update(req, res) {
        //await cuentaDao.update(req.body)
    },

    async delete(req, res) {
        await cuentaDao.delete(req.body)
        .then(() => res.status(200).send({message: "Se elimino la cuenta correctamente"}))
        .catch(error => res.status(400).send(error))
    },

    async getCuenta(req, res) {
        try {
            await cuentaDao.getcuentas(req.body)
            .then(cuenta => res.status(200).send(cuenta))
            .catch(error => res.status(400).send(error))
        } catch (error) {
            res.status(500).send({message: "Error al buscar la cuneta"})
        }
    },

    async getSaldo(req, res) {
        try {
            await cuentaDao.getSaldo(req.body)
            .then(saldo => {
                if (saldo)
                    res.status(200).send(saldo).end()

                res.status(300).send("No se pudo encontrar una cuenta o el saldo")
            })
            .catch(error => res.status(400).send("No se pudo encontrar la cuenta u obtener el saldo"))
        } catch (error) {
            res.status(500).send({message: "Error al buscar la cuneta"})
        }
    },

    async getResumenCuenta(req, res) {
        try {
            await cuentaDao.getcuentasByNumerocuentas(req.body.numero_cuenta)
            .then(resumen => res.status(200).send(resumen))
            .catch(error => {
                console.log(error)
                res.status(400).send(error)
            })
        } catch (error) {
            res.status(500).send({message: "Error al buscar la cuneta"})
        }
    },
};