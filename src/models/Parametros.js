'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Parametros = sequelize.define("Parametros", {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true,
        },
        parametro: {
            type: DataTypes.STRING,
            allowNull: false
        },
        valor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_creacion:{
            type: DataTypes.DATE
        },
        fecha_actualizacion:{
            type: DataTypes.DATE
        }
    }, {});
    return Parametros;
}