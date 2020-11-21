const bcrypt = require("bcrypt");
const { db } = require("../sequelize/models");
const {
  clientes,
  cuentas,
  empleados,
  usuarios,
  roles,
  facturas,
  codigos_autorizacion,
} = db;
const { CLIENTES_TIPO, CUENTAS_TIPO } = require("../../src/daos/common");

module.exports = async () => {
  console.log("Tarea Dar de Alta a Clientes por integraciones");

  const rol_cliente_fisico = await roles.findOne({
    where: { alias: "CLIENTE_PERSONA_FISICA" },
  });

  const rol_cliente_empresa = await roles.findOne({
    where: { alias: "CLIENTE_EMPRESA" },
  });

  const rol_banco = await roles.findOne({
    where: { alias: "EXTERNO_BANCO" },
  });

  const usuario_ejecutivo = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  const empleado_ejecutivo = await empleados.findOne({
    where: { usuario_id: usuario_ejecutivo.get("id") },
  });

  const usuario_banco_a = await usuarios.create({
    nombre_usuario: "banco_a.bankame",
    clave: await bcrypt.hash("kH3yt7zQxMCMDDwEQaZR8q6g6e525q", 8),
    rol_id: rol_banco.get("id"),
  });

  const cliente_banco = await clientes.create({
    tipo: CLIENTES_TIPO.EMPRESA,
    cuit: "BANCOA999999999",
    dni: "BANCOA999999999",
    nombre: "BANCO A",
    apellido: "Integraciones",
    email: "bancoa.integraciones@gmail.com",
    domicilio_ciudad: "Buenos Aires",
    domicilio_calle: "Lima",
    domicilio_barrio: "Monserrat",
    domicilio_numero: 1957,
    domicilio_piso: " ",
    domicilio_apartamento: " ",
    pregunta1: "pregunta 1",
    pregunta1_respuesta: "respuesta 1",
    pregunta2: "pregunta 2",
    pregunta2_respuesta: "respuesta 2",
    pregunta3: "pregunta 3",
    pregunta3_respuesta: "respuesta 3",
    usuario_id: usuario_banco_a.get("id"),
  });
};
