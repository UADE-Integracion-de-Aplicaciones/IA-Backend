const userDao = require('../daos/user.dao');

module.exports = {
    login(req, res) {
        const {nombreUsuario, clave} = req.query

        if (!req || !req.body || !clave || !nombreUsuario)
            res.status(300).send("No existn credenciales")
        userDao.getUserByUserName(nombreUsuario)
            .then(user => {
                if (!user) {
                    res.status(501).send("Hubo un error inesperado.")
                    return ;
                }

                if (user.clave === clave)
                    res.status(200).send("Se encontro el usuario")
                else 
                    res.status(301).send("Credenciales incompatibles")
            })
            .catch(err => {
                console.log(err)
                res.status(400)
            })
    },

    register(req, res) {
        if (!req || !req.body)
            res.status(300).send("No existn credenciales")
            
        userDao.registrar(req.body)
            .then(user => {
                if (!user) {
                    res.status(300).send("Hubo un error en la creacion del usuario.")
                    return ;
                }

                res.status(200).send("Usuario creado con exito.")
            })
            .catch(err => {
                console.log(err)
                res.status(400)
            })
    }
};