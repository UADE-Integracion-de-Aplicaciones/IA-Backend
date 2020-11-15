module.exports = (sequelize, { DataTypes }) => {
  const Roles = sequelize.define(
    "numeros_unicos",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cuenta_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      tomado_por: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    }
  );
  return Roles;
};
