'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Facturas = sequelize.define("Facturas", {
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
        codigo_pago_electronico: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numero_factura: {
            type: DataTypes.STRING,
            allowNull: false
        },
        importe: {
            type: DataTypes.DECIMAL(10,4),
            allowNull: false
        },
        fecha_vencimiento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_pagado: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fecha_creacion: {
            type: DataTypes.DATE,
        }
    }, {});
    return Facturas;
}