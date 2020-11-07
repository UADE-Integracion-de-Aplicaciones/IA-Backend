module.exports = (sequelize, DataTypes) => {
  const Cuentas = sequelize.define(
    "cuentas",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      cliente_id: {
        type: DataTypes.UUID,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numero_cuenta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cbu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fondo_descubierto: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
      },
      saldo: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
      },
      empleado_creador_id: {
        type: DataTypes.UUID,
      },
    },
    {}
  );
  return Cuentas;
};
