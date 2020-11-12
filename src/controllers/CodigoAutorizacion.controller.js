const moment = require('moment');
const codigoAutorizacionDao = require('../daos/codigoAutorizacion.dao');

module.exports = {
    validarCodigo(req, res) {
        const {cliente_id, codigo} = req.query

        if (!req || !req.body || !codigo || !cliente_id){
            res.status(300).send("No se enviaron los parametros adecuados")
            return ;
        }

        try {    
            codigoAutorizacionDao.buscarPorClienteId(cliente_id)
            .then(codigoAutorizacion => {
                if (!codigoAutorizacion) {
                    res.status(303).send("No se encontro ningun tipo de codigo de autorizacion relacionadl al cliente")
                    return ; 
                }

                const dayAfterExpiration = moment(codigoAutorizacion.fecha_expiracion).add(1, 'days')
                
                if (codigoAutorizacion.usado) {
                    res.status(304).send("El codigo ha sido utilizado")
                    return ;
                }
                
                if (codigo === codigoAutorizacion.codigo) {
                    if (!codigoAutorizacion.usado && moment().isBefore(dayAfterExpiration)) {
                        codigoAutorizacionDao.usarCodigo(codigoAutorizacion.id).then(resultado => {
                            if (resultado)
                                res.status(200).send("Codigo verificado con exito")
                            else
                                res.status(305).send("No se pudo verifivar el codigo")
                        })
                    } else 
                        res.status(302).send("El xoddigo ha expirado, por favor vuelva a crearlo")
                } else {
                    res.status(301).send("Codigo invalido")
                }
                return codigoAutorizacion
            })                
            .catch(err => {
                console.log(err)
                res.status(400).send("Ocurrio un erorr en la verificacion")
            })
        } catch (error) {
            console.log(error)
            res.status(500).send("Fallo algo en la aplicacion");
        }
    },

    async generarCodigoRegistro(req, res) {
        try {
            
            const { cliente_id } = req.body
            
            if (!req || !req.body || !cliente_id) {
                res.status(300).send("Existe un dato faltante")
                return ;
            }

            codigoAutorizacionDao.generarCodigo(cliente_id)
                .then(codigo => {
                    if (!codigo) {
                        res.status(301).send("Hubo un error en la creacion del codigo.")
                        return ;
                    }

                    res.status(200).send(codigo)
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).send("Ocurrio un error inesperado en la creacion del codigo")
                })
        } catch (error) {
            res.status(500).send("Error del servidor al generar el codigo de registro")
        }
    }
};