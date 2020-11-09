module.exports = (sequelize, { DataTypes, Sequelize }) => {
  const Empleados = sequelize.define(
    "empleados",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      fecha_ingreso: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      cargo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    }
  );
  return Empleados;
};
