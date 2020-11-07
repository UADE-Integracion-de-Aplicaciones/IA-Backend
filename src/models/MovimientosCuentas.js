module.exports = (sequelize, DataTypes) => {
  const MovimientosCuentas = sequelize.define(
    "movimientos_cuentas",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cuenta_id: {
        type: DataTypes.UUID,
      },
      concepto_movimiento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
      },
      movimiento_cuenta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {}
  );
  return MovimientosCuentas;
};
