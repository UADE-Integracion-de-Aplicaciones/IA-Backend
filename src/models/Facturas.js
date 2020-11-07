module.exports = (sequelize, DataTypes) => {
  const Facturas = sequelize.define(
    "Facturas",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cuenta_id: {
        type: DataTypes.UUID,
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
        allowNull: false,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
      },
    },
    {}
  );
  return Facturas;
};
