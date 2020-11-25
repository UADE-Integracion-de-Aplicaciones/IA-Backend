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
const { crear: crearCuenta } = require("../daos/cuentas.dao");
const { depositarEnCuentaPropia } = require("../daos/transacciones.dao");

module.exports = async () => {
  console.log("Tarea Dar de Alta a Clientes por integraciones");

  const rol_cliente_fisico = await roles.findOne({
    where: { alias: "CLIENTE_PERSONA_FISICA" },
  });

  const rol_cliente_empresa = await roles.findOne({
    where: { alias: "CLIENTE_EMPRESA" },
  });

  const rol_cliente_proveedor = await roles.findOne({
    where: { alias: "CLIENTE_PROVEEDOR" },
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

  const usuario_escuela_b = await usuarios.create({
    nombre_usuario: "escuelab.bankame",
    clave: await bcrypt.hash("Escuelab1234", 8),
    rol_id: rol_cliente_proveedor.get("id"),
  });

  const cliente_escuela_b = await clientes.create({
    tipo: CLIENTES_TIPO.PROVEEDOR,
    cuit: "202425211",
    dni: "242521",
    nombre: "ESCUELA B",
    apellido: "Institución",
    email: "escuelab.integraciones@gmail.com",
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
    usuario_id: usuario_escuela_b.get("id"),
  });

  const cuenta_escuela_b = await crearCuenta({
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    cliente_id: cliente_escuela_b.get("id"),
    fondo_descubierto: 10000.0,
    usuario_id: usuario_ejecutivo.get("id"),
  });

  const usuario_supermercado_b = await usuarios.create({
    nombre_usuario: "supersarasa.bankame",
    clave: await bcrypt.hash("!supersegura!", 8),
    rol_id: rol_cliente_empresa.get("id"),
  });

  const cliente_supermercado_b = await clientes.create({
    tipo: CLIENTES_TIPO.EMPRESA,
    cuit: "30111111118",
    dni: "11111111",
    nombre: "Super Sarasa",
    apellido: "Establecimiento",
    email: "supermercadosarasa@gmail.com",
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
    usuario_id: usuario_supermercado_b.get("id"),
  });

  const cuenta_supermercado_b = await crearCuenta({
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    cliente_id: cliente_supermercado_b.get("id"),
    fondo_descubierto: 10000.0,
    usuario_id: usuario_ejecutivo.get("id"),
  });

  const usuario_gimnasio_a = await usuarios.create({
    nombre_usuario: "gimnasio_a.bankame",
    clave: await bcrypt.hash("123456", 8),
    rol_id: rol_cliente_empresa.get("id"),
  });

  const cliente_gimnasio_a = await clientes.create({
    tipo: CLIENTES_TIPO.EMPRESA,
    cuit: "20987654325",
    dni: "98765432",
    nombre: "Gimnasio A",
    apellido: "Establecimiento",
    email: "dnaranjolopez@uade.edu.ar",
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
    usuario_id: usuario_gimnasio_a.get("id"),
  });

  const cuenta_gimnasio_a = await crearCuenta({
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    cliente_id: cliente_gimnasio_a.get("id"),
    fondo_descubierto: 10000.0,
    usuario_id: usuario_ejecutivo.get("id"),
  });

  await depositarEnCuentaPropia(cuenta_gimnasio_a.get("numero_cuenta"))({
    dni: cliente_gimnasio_a.get("dni"),
    usuario: usuario_gimnasio_a,
    cantidad: 2000000.0,
  });

  const usuario_tarjetas_b = await usuarios.create({
    nombre_usuario: "tarjetas_b.bankame",
    clave: await bcrypt.hash("TarjetasB@12345", 8),
    rol_id: rol_cliente_proveedor.get("id"),
  });

  const cliente_tarjetas_b = await clientes.create({
    tipo: CLIENTES_TIPO.PROVEEDOR,
    cuit: "2065656564435",
    dni: "6565656443",
    nombre: "Tarjetas B",
    apellido: "Proveedor",
    email: "tarjetasb@gmail.com",
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
    usuario_id: usuario_tarjetas_b.get("id"),
  });

  const cuenta_tarjetas_b = await crearCuenta({
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    cliente_id: cliente_tarjetas_b.get("id"),
    fondo_descubierto: 100000.0,
    usuario_id: usuario_ejecutivo.get("id"),
  });

  await depositarEnCuentaPropia(cuenta_tarjetas_b.get("numero_cuenta"))({
    dni: cliente_tarjetas_b.get("dni"),
    usuario: usuario_tarjetas_b,
    cantidad: 10000000.0,
  });

  const usuario_gimnasio_b = await usuarios.create({
    nombre_usuario: "gimnasio_b.bankame",
    clave: await bcrypt.hash("GimnasioB@12323", 8),
    rol_id: rol_cliente_empresa.get("id"),
  });

  const cliente_gimnasio_b = await clientes.create({
    tipo: CLIENTES_TIPO.EMPRESA,
    cuit: "20765432325",
    dni: "7654323",
    nombre: "CityGym B",
    apellido: "Establecimiento",
    email: "citygymb@gmail.com",
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
    usuario_id: usuario_gimnasio_b.get("id"),
  });

  const cuenta_gimnasio_b = await crearCuenta({
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    cliente_id: cliente_gimnasio_b.get("id"),
    fondo_descubierto: 10000.0,
    usuario_id: usuario_ejecutivo.get("id"),
  });
};
