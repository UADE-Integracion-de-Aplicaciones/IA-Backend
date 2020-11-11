module.exports = (sequelize, { DataTypes }) => {
  const Facturas = sequelize.define(
    "facturas",
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
      codigo_pago_electronico: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numero_factura: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      importe: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
      },
      fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      fecha_pagado: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    }
  );
  return Facturas;
};
