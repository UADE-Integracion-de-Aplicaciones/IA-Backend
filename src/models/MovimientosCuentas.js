'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const MovimientosCuentas = sequelize.define("MovimientosCuentas", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cuenta_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        concepto_movimiento_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.DECIMAÑ(10,4),
            allowNull: false
        },
        movimiento_cuenta_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {});
    return MovimientosCuentas;
}