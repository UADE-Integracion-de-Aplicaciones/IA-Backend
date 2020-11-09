const Sequelize = require('sequelize');
const cuenta = require('../sequelize/models').cuentas;
const movimientos = require('../sequelize/models').momivimientosCuentas;

module.exports = {
    async create(payload) {
        const {tipo, cliete_id, fondo_descubierto, saldo, empleado_creador_id} = payload;  
        const numero_cuenta = this.generarNumeroCuenta();
        const cbu = this.generarCBU(numero_cuenta);
        return await cuenta.create ({
            tipo: tipo, cliete_id: cliete_id, numero_cuenta: numero_cuenta, cbu: cbu, fondo_descubierto: fondo_descubierto, saldo:saldo, empleado_creador_id: empleado_creador_id
        })
    },

    //TODO
    //Que campos se van a poder modificar?
    update(payload) {
        const cuenta = await this.buscarCuenta(payload);
    },

    async delete(payload) {
        const cuenta = this.buscarCuenta(payload);
        return await cuenta.destroy();
    },

    // Retorna la cuenta
    async getCuenta(payload) {
        const cuenta = this.buscarCuenta(payload)
        return cuenta
    },

    async getSaldo(payload){
        const cuenta = this.buscarCuenta(payload);
        //let saldo = cuenta.findAll({ attributes: 'saldo'})
        return cuenta.saldo
    },

    // Por ahora devuelve todos los movimientos con ese ID
    // Habria que mockear como vamos a devolver el resumen
    async getResumenCuenta(payload){
        const cuenta = this.buscarCuenta(payload);
        return movimientos.findAll({
            where:{
                cuenta_id: cuenta.id
            }
        })
    },

    // se genera un numero de cuenta random de 13 digitos
    generarNumeroCuenta(){
        let numero = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
        return numero
    },

    // se genera el CBU con el numero random de la cuenta y con las otras especificaciones de un CBU
    generarCBU(numero_cuenta){
        let numeroBanco = "001"
        let numeroSucursal = "0001"
        let digitoVerificador7 = Math.floor(1 + Math.random() * 9).toString();
        let digitoVerificador13 = Math.floor(1 + Math.random() * 9).toString();
        let cbu = numeroBanco.concat(numeroSucursal).concat(digitoVerificador7).concat(numero_cuenta).concat(digitoVerificador13)
        return cbu
    },

    //Recibe el payload (body del req) y chequea si tiene numero de cuenta o cbu
    buscarCuenta(payload) {
        if (payload.numero_cuenta)
            return this.getCuentaByNumeroCuenta(payload.numero_cuenta)
        else if (payload.cbu)
            return this.getCuentaByCBU(payload.cbu)
        throw Error("No se encontro un campo valido")
    },

    getCuentaByNumeroCuenta(numero_cuenta) {
        return cuenta.findOne({
            where: {
                numero_cuenta: numero_cuenta
            }
        })
    },    

    getCuentaByCBU(cbu) {
        return cuenta.findOne({
            where: {
                cbu: cbu
            }
        })
    },

};