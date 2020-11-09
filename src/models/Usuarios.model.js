'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, { DataTypes, Sequelize }) => {
  const Usuario = sequelize.define(
    "usuarios",
    {
      usuario_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: (uuidv4())
      },
      batatas: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clave: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  return Usuario;
};
