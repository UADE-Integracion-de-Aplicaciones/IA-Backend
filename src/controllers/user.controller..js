var env = require('node-env-file');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userDao = require('../daos/user.dao');

module.exports = {
    async login(req, res) {
        const {nombre_usuario, clave} = req.query

        if (!req || !req.query || !clave || !nombre_usuario){
            res.status(300).send("No existn credenciales")
            return ;
        }
            
        userDao.getUserByUserName(nombre_usuario)
            .then(user => {                    
                    if (!user) {
                        res.status(301).send("Credenciales incompatibles")
                        return ;
                    }

                    const passwordCheck = bcrypt.compare(clave, user.clave);

                    if (!passwordCheck){
                        res.status(302).send("Credenciales incompatibles")
                        return
                    }

                    this.generarMensajeExito("Se logeo con exito.", user, res);
            }).catch(err => {
                console.log(err)
                res.status(400).send("Ocurrio algo")
            })
    },

    async register(req, res) {
        try  {
            const { nombre_usuario, clave, rol_id } = req.query
        
            console.log(nombre_usuario, clave)
            if (!req || !req.query || !clave || !nombre_usuario || !rol_id) {
                res.status(300).send("hubo un error")
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

                    this.generarMensajeExito("Usuario creado con exito.", user, res);
                })
                .catch(err => {
                    console.log(err)
                    res.status(400)
                })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "something wrong happened" });
        }
    },
    
    generarMensajeExito(mensaje, user, res) {
        console.log(user.id)
        const token = this.getToken({ userId: user.id });
        res.append("x-access-token", token).status(200).json({message: mensaje, user: user});
    },

    getToken(data) {
        return jwt.sign(data, process.env.APP_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
        });
    }
};
