'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Cuentas = sequelize.define("Cuentas", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        cliente_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numero_cuenta: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cbu: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fondo_descubierto: {
            type: DataTypes.DECIMAL(10,4),
            allowNull: false
        },
        saldo: {
            type: DataTypes.DECIMAL(10,4),
            allowNull: false
        },
        empleado_creador_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        }
    }, {});
    return Cuentas;
}