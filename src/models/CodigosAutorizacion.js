module.exports = (sequelize, DataTypes) => {
  const CodigosAutorizacion = sequelize.define(
    "codigos_autorizacion",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cliente_id: {
        type: DataTypes.UUID,
      },
      codigo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_expiracion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dias_vigencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {}
  );
  return CodigosAutorizacion;
};
