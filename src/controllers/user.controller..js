const userDao = require('../daos/user.dao');

module.exports = {
    login(req, res) {
        const {nombreUsuario, clave} = req.query

        if (!req || !req.body || !clave || !nombreUsuario)
            res.status(300).send("No existn credenciales")
            
            console.log(req.query, nombreUsuario, clave);
            userDao.getUserByUserName(nombreUsuario)
                .then(user => {
                    console.log(user.clave, clave, user)
                    if (user && user.clave === clave)
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
        const { clave, nombreUsuario } = req.query
        
        if (!req || !req.query || !clave || !nombreUsuario) {
            res.status(300).send(req.query)
            return ;
        }
        userDao.registrar(req.query)
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