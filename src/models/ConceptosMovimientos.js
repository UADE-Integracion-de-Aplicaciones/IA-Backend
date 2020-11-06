'use strict';
const { Sequelize } = require('sequelize');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const ConceptosMovimientos = sequelize.define("ConceptosMovimientos", {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_creacion:{
            type: DataTypes.DATE
        }
    }, {});
    return ConceptosMovimientos;
}