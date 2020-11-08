module.exports = (sequelize, { DataTypes }) => {
  const ConceptosMovimientos = sequelize.define(
    "conceptos_movimientos",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alias: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: false,
    }
  );
  return ConceptosMovimientos;
};
