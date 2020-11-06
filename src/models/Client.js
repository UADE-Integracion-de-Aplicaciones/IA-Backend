'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define("Client", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cuit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dni: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        domicilio_ciudad: {
            type: DataTypes.STRING,
            allowNull: false
        },
        domicilio_calle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        domicilio_barrio: {
            type: DataTypes.STRING,
            allowNull: false
        },
        domicilio_numero: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        domicilio_piso: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apartamento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_nacimiento:{
            type: DataTypes.DATEONLY
        },
        pregunta1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pregunta1_respuesta: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pregunta2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pregunta2_respuesta: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pregunta3: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pregunta3_respuesta: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usuario_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        fecha_creacion:{
            type: DataTypes.DATEONLY
        }
    }, {});
    return Client;
}