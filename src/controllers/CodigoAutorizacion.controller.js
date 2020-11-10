const moment = require('moment');
const codigoAutorizacionDao = require('../daos/codigoAutorizacion.dao');

module.exports = {
    validarCodigo(req, res) {
        const {cliente_id, codigo} = req.query

        if (!req || !req.body || !codigo || !cliente_id){
            res.status(300).send("No se enviaron los parametros adecuados")
            return ;
        }

        codigoAutorizacionDao.buscarPorClienteId(cliente_id)
            .then(codigoAutorizacion => {
                const dayAfterExpiration = moment(codigoAutorizacion.fecha_expiracion).add(1, 'days')
                if (codigo === codigoAutorizacion.codigo) {
                    if (!codigoAutorizacion.usado && moment().isBefore(dayAfterExpiration))
                        res.status(200).send("Codigo verificado con exito")
                    else 
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
    },

    generarCodigoRegistro(req, res) {
        const { cliente_id } = req.query
        
        if (!req || !req.query || !cliente_id) {
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
                res.status(400)
            })
    }
};