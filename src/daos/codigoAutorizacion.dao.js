const codigoAutorizacion = require('../sequelize/models/').db.codigos_autorizacion
const moment = require('moment');

const LONGITUD_CCODIGO = 6;
const DIAS_VIGENCIA = 2;
module.exports = {
    //Crea una transaccion / eposito de cuenta
    async generarCodigo(cliente_id) {
        let codigo = nuevoCodigo(LONGITUD_CCODIGO)
        const fechaExpiracion = moment().add(2, 'days').format("YYYY-MM-DD");;
        return await crearCodigo(cliente_id, codigo, fechaExpiracion)
    },

    async buscarPorClienteId(cliente_id) {
        return await codigoAutorizacion.findAll({ 
            limit: 1,
            where: { cliente_id: cliente_id },
            order: [ [ 'fecha_creacion', 'DESC' ]]
        }).then(entries => entries[0])
    },

    async usarCodigo(codigo_id) {
        return await codigoAutorizacion.update({usado: true},{where: {id: codigo_id}})
    }
};



let crearCodigo = async (cliente_id, codigo, fechaExpiracion) => {
    return await codigoAutorizacion
        .create ({
            cliente_id: cliente_id,
            codigo: codigo,
            fecha_expiracion: fechaExpiracion,
            dias_vigencia: DIAS_VIGENCIA,
            usado: false
        })
}

let nuevoCodigo = (longitud) => {
    var codigo = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var longitudCaracteres = caracteres.length;
    for ( var i = 0; i < longitud; i++ ) {
       codigo += caracteres.charAt(Math.floor(Math.random() * longitudCaracteres));
    }
    return codigo;
}