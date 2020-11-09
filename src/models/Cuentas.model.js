module.exports = (sequelize, { DataTypes, Sequelize }) => {
  const Cuentas = sequelize.define(
    "cuentas",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
    {
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
      paranoid: true,
      deletedAt: "fecha_borrado",
    }
  );
  return Cuentas;
};
