module.exports = (sequelize, DataTypes) => {
  const Parametros = sequelize.define(
    "parametros",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      parametro: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
      },
      fecha_actualizacion: {
        type: DataTypes.DATE,
      },
    },
    {}
  );
  return Parametros;
};
