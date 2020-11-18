module.exports = (sequelize, { DataTypes }) => {
  const MovimientosCuentas = sequelize.define(
    "movimientos_cuentas",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cuenta_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      concepto_movimiento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
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
      },
      usuario_creador_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: false,
    }
  );
  return MovimientosCuentas;
};
