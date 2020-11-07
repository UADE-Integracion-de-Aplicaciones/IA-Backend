module.exports = (sequelize, DataTypes) => {
  const Empleados = sequelize.define(
    "empleados",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
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
      },
      fecha_ingreso: {
        type: DataTypes.DATEONLY,
      },
      cargo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.UUID,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
      },
    },
    {}
  );
  return Empleados;
};
