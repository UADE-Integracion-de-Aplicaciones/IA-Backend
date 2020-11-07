module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "Usuarios",
    {
      usuario_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      nombreUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clave: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
      },
    },
    {}
  );
  return User;
};