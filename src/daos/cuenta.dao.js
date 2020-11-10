const { db } = require("../sequelize/models");
const { cuentas } = db;
const movimientos = require('../sequelize/models').momivimientoscuentass;

module.exports = {
    async create(payload) {
        const {tipo, cliete_id, fondo_descubierto, saldo, empleado_creador_id} = payload;  
        const numero_cuenta = this.generarNumerocuentas();
        const cbu = this.generarCBU(numero_cuenta);
        return await cuentas.create ({
            tipo: tipo, cliete_id: cliete_id, numero_cuenta: numero_cuenta, cbu: cbu, fondo_descubierto: fondo_descubierto, saldo:saldo, empleado_creador_id: empleado_creador_id
        })
    },

    //TODO
    //Que campos se van a poder modificar?
    update(payload) {
        //const cuentas = this.buscarcuentas(payload);
    },

    async delete(payload) {
        const cuentas = this.buscarcuentas(payload);
        return await cuentas.destroy();
    },

    // Retorna la cuentas
    async getcuentas(payload) {
        const cuentas = this.buscarcuentas(payload)
        return cuentas
    },

    async getSaldo(payload){
        const cuentas = this.buscarcuentas(payload);
        //let saldo = cuentas.findAll({ attributes: 'saldo'})
        return cuentas.get('saldo')
    },

    // Por ahora devuelve todos los movimientos con ese ID
    // Habria que mockear como vamos a devolver el resumen
    async getResumencuentas(payload){
        const cuentas = this.buscarcuentas(payload);
        return movimientos.findAll({
            where:{
                cuentas_id: cuentas.id
            }
        })
    },

    // se genera un numero de cuentas random de 13 digitos
    generarNumerocuentas(){
        let numero = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
        return numero
    },

    // se genera el CBU con el numero random de la cuentas y con las otras especificaciones de un CBU
    generarCBU(numero_cuentas){
        let numeroBanco = "001"
        let numeroSucursal = "0001"
        let digitoVerificador7 = Math.floor(1 + Math.random() * 9).toString();
        let digitoVerificador13 = Math.floor(1 + Math.random() * 9).toString();
        let cbu = numeroBanco.concat(numeroSucursal).concat(digitoVerificador7).concat(numero_cuentas).concat(digitoVerificador13)
        return cbu
    },

    //Recibe el payload (body del req) y chequea si tiene numero de cuentas o cbu
    buscarcuentas(payload) {
        if (payload.numero_cuentas)
            return this.getcuentasByNumerocuentas(payload.numero_cuentas)
        else if (payload.cbu)
            return this.getcuentasByCBU(payload.cbu)
        throw Error("No se encontro un campo valido")
    },

    getcuentasByNumerocuentas(numero_cuentas) {
        return cuentas.findOne({
            where: {
                numero_cuentas: numero_cuentas
            }
        })
    },    

    getcuentasByCBU(cbu) {
        return cuentas.findOne({
            where: {
                cbu: cbu
            }
        })
    },

};