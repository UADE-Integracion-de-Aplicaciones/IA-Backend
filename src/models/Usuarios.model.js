module.exports = (sequelize, { DataTypes, Sequelize }) => {
  const Usuario = sequelize.define(
    "usuarios",
    {
      usuario_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clave: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
      paranoid: true,
      deletedAt: "fecha_borrado",
    }
  );
  return Usuario;
};
