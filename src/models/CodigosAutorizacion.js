'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const CodigoAutorizacion = sequelize.define("CodigoAutorizacion", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cliente_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_expiracion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        dias_vigencia: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        usado: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {});
    return CodigoAutorizacion;
}