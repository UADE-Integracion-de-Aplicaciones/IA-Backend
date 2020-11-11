var env = require('node-env-file');

const {bcrypt} = require("bcrypt");
const {jwt} = require("jsonwebtoken");

const userDao = require('../daos/user.dao');

module.exports = {
    async login(req, res) {
        const {nombreUsuario, clave} = req.query

        if (!req || !req.query || !clave || !nombreUsuario)
            res.status(300).send("No existn credenciales")
            
            userDao.getUserByUserName(nombreUsuario)
                .then(user => {                    
                        if (!user) {
                            res.status(301).send("Credenciales incompatibles")
                            return
                        }

                        const passwordCheck = bcrypt.compare(clave, user.clave);

                        if (!passwordCheck){
                            res.status(302).send("Credenciales incompatibles")
                            return
                        }

                        generarMensajeExito("Se logeo con exito.", user);
                    })
                .catch(err => {
                    console.log(err)
                    res.status(400).send("Ocurrio algo")
                })
    },

    async register(req, res) {
        try  {
            const { nombre_usuario, clave, rol_id } = req.query
        
            if (!req || !req.query || !clave || !nombreUsuario || !rol_id) {
                res.status(300).send(req.query)
                return ;
            }

            const secret = await bcrypt.hash(clave, 8);

            userDao.registrar(nombre_usuario, secret, rol_id)
                .then(user => {
                    if (!user) {
                        res.status(300).send("Hubo un error en la creacion del usuario.")
                        return ;
                    }
                    console.log("User id",  user.id)

                    generarMensajeExito("Usuario creado con exito.", user);
                })
                .catch(err => {
                    console.log(err)
                    res.status(400)
                })
        } catch (error) {
            return res.status(500).json({ message: "something wrong happened" });
        }
    },
    
    generarMensajeExito(mensaje, user) {
        const token = getToken({ userId: user.id });
        res.append("x-access-token", token).status(200).json({message: mensaje, user: user});
    },

    getToken(data) {
        return jwt.sign(data, process.env.APP_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
        });
    }
};
