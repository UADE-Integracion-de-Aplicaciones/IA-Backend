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
                    res.status(301).json({message: "Credenciales incompatibles"});
                   // res.status(301).send("Credenciales incompatibles")
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
        
            if (!req || !req.query || !clave || !nombre_usuario || !rol_id) {
                res.status(300).send("Faltan parametros")
                return ;
            }

            const secret = await bcrypt.hash(clave, 8);
            const existeUsuario = await userDao.getUserByUserName(nombre_usuario);

            if (existeUsuario) {
                res.status(302).send("El nombre de usuario ya ha sido escogio por otra persona");
                return ;
            }

            userDao.registrar(nombre_usuario, secret, rol_id)
                .then(user => {
                    if (!user) {
                        res.status(301).send("Hubo un error en la creacion del usuario.")
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
        res.status(200).json({message: mensaje, user: user, "token": token});
    },

    getToken(data) {
        return jwt.sign(data, process.env.APP_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
        });
    },

    async verificarUsuario(req, res) {
        try {
            const { id } = req.body
            
            if (!id) {
                res.status(301).send("Parametros inexistentes o incompatibles.")
                return ;
            }
            
            await userDao.getUserById(id)
                .then(usuario => {
                    if (usuario) {
                        if (usuario.id) {
                          res.status(200).send(usuario)
                          return usuario
                        }
                        res.status(300).send("No se pudo encontrar un usuario.")
                        return ;
                    } else {
                        res.status(400).send("Ocurrio un problema al buscar el usuario")
                    }
                }).catch(error => {
                    console.log(error)
                    res.status(401).send("Error al buscar usuario")
                });
          } catch (error) {
            res.status(500).send("Ocurrio un problema en el servidor al buscar el usuario por id")
          }
    }
};
