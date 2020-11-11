module.exports = (sequelize) => {
  const { models } = sequelize;
  models.clientes.belongsTo(models.usuarios, {
    foreignKey: { name: "usuario_id", allowNull: true },
  });
  models.empleados.belongsTo(models.usuarios, {
    foreignKey: { name: "usuario_id", allowNull: false },
  });
  models.cuentas.belongsTo(models.clientes, {
    foreignKey: { name: "cliente_id", allowNull: false },
  });
  models.cuentas.belongsTo(models.empleados, {
    foreignKey: { name: "empleado_creador_id", allowNull: false },
  });
  models.facturas.belongsTo(models.cuentas, {
    foreignKey: { name: "cuenta_id", allowNull: false },
  });
  models.codigos_autorizacion.belongsTo(models.clientes, {
    foreignKey: { name: "cliente_id", allowNull: false },
  });
  models.movimientos_cuentas.belongsTo(models.cuentas, {
    foreignKey: { name: "cuenta_id", allowNull: false },
  });
  models.movimientos_cuentas.belongsTo(models.conceptos_movimientos, {
    foreignKey: { name: "concepto_movimiento_id", allowNull: false },
  });
  models.movimientos_cuentas.belongsTo(models.movimientos_cuentas, {
    foreignKey: { name: "movimiento_cuenta_id", allowNull: true },
  });
  models.movimientos_cuentas.belongsTo(models.usuarios, {
    foreignKey: { name: "usuario_creador_id", allowNull: false },
  });
  models.usuarios.belongsTo(models.roles, {
    foreignKey: { name: "rol_id", allowNull: false },
  });
};
