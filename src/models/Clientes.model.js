module.exports = (sequelize, { DataTypes, Sequelize }) => {
  const Clientes = sequelize.define(
    "clientes",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cuit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domicilio_ciudad: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domicilio_calle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domicilio_barrio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domicilio_numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      domicilio_piso: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domicilio_apartamento: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      pregunta1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pregunta1_respuesta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pregunta2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pregunta2_respuesta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pregunta3: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pregunta3_respuesta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.UUID,
        allowNull: true,
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

  return Clientes;
};
