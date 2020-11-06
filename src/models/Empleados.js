'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Empleados = sequelize.define("Empleados", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_nacimiento:{
            type: DataTypes.DATEONLY
        },
        fecha_ingreso:{
            type: DataTypes.DATEONLY
        },
        cargo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usuario_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        fecha_creacion:{
            type: DataTypes.DATE
        }
    }, {});
    return Empleados;
}