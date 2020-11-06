'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        usuario_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: (uuid()),
        },
        nombreUsuario: {
            type: DataTypes.STRING,
            allowNull: false
        },
        clave: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_creacion:{
            type: DataTypes.DATE
        }
    }, {});
    return User;
}