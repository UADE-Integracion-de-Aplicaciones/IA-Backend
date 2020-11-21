const bcrypt = require("bcrypt");
const moment = require("moment");
const {
  CLIENTES_TIPO,
  CUENTAS_TIPO,
  SERVICE_DETAILS,
} = require("../../src/daos/common");
const { db, syncDb } = require("../../src/sequelize/models");
const {
  clientes,
  cuentas,
  empleados,
  usuarios,
  roles,
  facturas,
  codigos_autorizacion,
} = db;
const {
  generarNumeroCuenta,
  generarCBU,
} = require("../../src/daos/cuentas.dao");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const generarNumeroCuentaCBU = () => {
  const { numero_sucursal_por_defecto: numero_sucursal } = SERVICE_DETAILS;

  const numero_cuenta = generarNumeroCuenta();
  const cbu = generarCBU({
    numero_cuenta,
    numero_sucursal,
  });
  return { numero_cuenta, cbu };
};

const crearData = async () => {
  await sleep(200);

  const rol1 = await roles.findOne({ where: { alias: "BANCO_EJECUTIVO" } });
  const rol2 = await roles.findOne({
    where: { alias: "CLIENTE_PERSONA_FISICA" },
  });

  const usuarioA = await usuarios.create({
    nombre_usuario: "alejandro.otero",
    clave: await bcrypt.hash("123", 8),
    rol_id: rol1.get("id"),
  });

  const usuario_cliente_B = await usuarios.create({
    nombre_usuario: "abc",
    clave: await bcrypt.hash("123", 8),
    rol_id: rol2.get("id"),
  });

  const empleadoA = await empleados.create({
    nombre: "Alejandro",
    apellido: "Otero",
    fecha_nacimiento: "1998-01-01",
    fecha_ingreso: "2020-01-05",
    cargo: "ejecutivo",
    usuario_id: usuarioA.get("id"),
  });

  const usuario_cliente_A = await usuarios.create({
    nombre_usuario: "pedro.perez",
    clave: await bcrypt.hash("123", 8),
    rol_id: rol2.get("id"),
  });

  const clienteA = await clientes.create({
    tipo: CLIENTES_TIPO.PERSONA_FISICA,
    cuit: "65544333",
    dni: "123456789",
    nombre: "Pedro",
    apellido: "Perez",
    email: "pedroperez@gmail.com",
    domicilio_ciudad: "Buenos Aires",
    domicilio_calle: "Santa Fe",
    domicilio_barrio: "Recoleta",
    domicilio_numero: 1425,
    domicilio_piso: "8",
    domicilio_apartamento: "D",
    fecha_nacimiento: "2000-11-01",
    pregunta1: "pregunta 1",
    pregunta1_respuesta: "respuesta 1",
    pregunta2: "pregunta 2",
    pregunta2_respuesta: "respuesta 2",
    pregunta3: "pregunta 3",
    pregunta3_respuesta: "respuesta 3",
    usuario_id: usuario_cliente_A.get("id"),
  });

  const codigo_autoriza = await codigos_autorizacion.create({
    cliente_id: clienteA.get("id"),
    codigo: "CODIGO_871",
    fecha_expiracion: moment()
      .add(2, "days")
      .format("YYYY-MM-DD"),
    dias_vigencia: 2,
    usado: false,
  });

  const clienteB = await clientes.create({
    tipo: CLIENTES_TIPO.PERSONA_FISICA,
    cuit: "767545",
    dni: "987654321",
    nombre: "Carlos",
    apellido: "Sanchez",
    email: "carlossanchez@gmail.com",
    domicilio_ciudad: "Buenos Aires",
    domicilio_calle: "Santa Fe",
    domicilio_barrio: "Recoleta",
    domicilio_numero: 901,
    domicilio_piso: "4",
    domicilio_apartamento: "E",
    fecha_nacimiento: "1995-03-01",
    pregunta1: "pregunta 1",
    pregunta1_respuesta: "respuesta 1",
    pregunta2: "pregunta 2",
    pregunta2_respuesta: "respuesta 2",
    pregunta3: "pregunta 3",
    pregunta3_respuesta: "respuesta 3",
    usuario_id: usuario_cliente_B.get("id"),
  });

  const clienteC = await clientes.create({
    tipo: CLIENTES_TIPO.PROVEEDOR,
    cuit: "154657667",
    dni: "5465766",
    nombre: "Tomas",
    apellido: "Tevez",
    email: "tomastevez@gmail.com",
    domicilio_ciudad: "Buenos Aires",
    domicilio_calle: "Parana",
    domicilio_barrio: "San Nicolas",
    domicilio_numero: 35,
    domicilio_piso: "7",
    domicilio_apartamento: "B",
    fecha_nacimiento: "1997-06-03",
    pregunta1: "pregunta 1",
    pregunta1_respuesta: "respuesta 1",
    pregunta2: "pregunta 2",
    pregunta2_respuesta: "respuesta 2",
    pregunta3: "pregunta 3",
    pregunta3_respuesta: "respuesta 3",
  });

  const {
    numero_cuenta: numero_cuenta_A1,
    cbu: cbu_cuenta_A1,
  } = generarNumeroCuentaCBU();

  const cuentaA1 = await cuentas.create({
    cliente_id: clienteA.get("id"),
    tipo: CUENTAS_TIPO.CAJA_DE_AHORRO,
    numero_cuenta: numero_cuenta_A1,
    cbu: cbu_cuenta_A1,
    fondo_descubierto: 0.0,
    saldo: 5000.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const {
    numero_cuenta: numero_cuenta_A2,
    cbu: cbu_cuenta_A2,
  } = generarNumeroCuentaCBU();

  const cuentaA2 = await cuentas.create({
    cliente_id: clienteA.get("id"),
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    numero_cuenta: numero_cuenta_A2,
    cbu: cbu_cuenta_A2,
    fondo_descubierto: 1.0,
    saldo: 1000.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const {
    numero_cuenta: numero_cuenta_B1,
    cbu: cbu_cuenta_B1,
  } = generarNumeroCuentaCBU();

  const cuentaB1 = await cuentas.create({
    cliente_id: clienteB.get("id"),
    tipo: CUENTAS_TIPO.CAJA_DE_AHORRO,
    numero_cuenta: numero_cuenta_B1,
    cbu: cbu_cuenta_B1,
    fondo_descubierto: 0.0,
    saldo: 150000.5,
    empleado_creador_id: empleadoA.get("id"),
  });

  const {
    numero_cuenta: numero_cuenta_B2,
    cbu: cbu_cuenta_B2,
  } = generarNumeroCuentaCBU();

  const cuentaB2 = await cuentas.create({
    cliente_id: clienteB.get("id"),
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    numero_cuenta: numero_cuenta_B2,
    cbu: cbu_cuenta_B2,
    fondo_descubierto: 5000.0,
    saldo: 30000.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const {
    numero_cuenta: numero_cuenta_C1,
    cbu: cbu_cuenta_C1,
  } = generarNumeroCuentaCBU();

  const cuentaC1 = await cuentas.create({
    cliente_id: clienteC.get("id"),
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    numero_cuenta: numero_cuenta_C1,
    cbu: cbu_cuenta_C1,
    fondo_descubierto: 10000.0,
    saldo: 100.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const {
    numero_cuenta: numero_cuenta_C2,
    cbu: cbu_cuenta_C2,
  } = generarNumeroCuentaCBU();

  const cuentaC2 = await cuentas.create({
    cliente_id: clienteC.get("id"),
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    numero_cuenta: numero_cuenta_C2,
    cbu: cbu_cuenta_C2,
    fondo_descubierto: 10000.0,
    saldo: -3000.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const {
    numero_cuenta: numero_cuenta_C3,
    cbu: cbu_cuenta_C3,
  } = generarNumeroCuentaCBU();

  const cuentaC3 = await cuentas.create({
    cliente_id: clienteC.get("id"),
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    numero_cuenta: numero_cuenta_C3,
    cbu: cbu_cuenta_C3,
    fondo_descubierto: 10000.0,
    saldo: -3000.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const {
    numero_cuenta: numero_cuenta_C4,
    cbu: cbu_cuenta_C4,
  } = generarNumeroCuentaCBU();

  const cuentaC4 = await cuentas.create({
    cliente_id: clienteC.get("id"),
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    numero_cuenta: numero_cuenta_C4,
    cbu: cbu_cuenta_C4,
    fondo_descubierto: 8000.0,
    saldo: -2000.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const {
    numero_cuenta: numero_cuenta_C5,
    cbu: cbu_cuenta_C5,
  } = generarNumeroCuentaCBU();

  const cuentaC5 = await cuentas.create({
    cliente_id: clienteC.get("id"),
    tipo: CUENTAS_TIPO.CUENTA_CORRIENTE,
    numero_cuenta: numero_cuenta_C5,
    cbu: cbu_cuenta_C5,
    fondo_descubierto: 2000.0,
    saldo: -2000.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const factura1 = await facturas.create({
    cuenta_id: cuentaC1.get("id"),
    codigo_pago_electronico: "345653312325464",
    numero_factura: "1",
    importe: 890.54,
    fecha_vencimiento: "2020-11-20",
  });

  const factura2 = await facturas.create({
    cuenta_id: cuentaC1.get("id"),
    codigo_pago_electronico: "345653312325464",
    numero_factura: "2",
    importe: 1100.3,
    fecha_vencimiento: "2020-12-10",
  });

  const factura3 = await facturas.create({
    cuenta_id: cuentaC1.get("id"),
    codigo_pago_electronico: "345653312325464",
    numero_factura: "3",
    importe: 450.7,
    fecha_vencimiento: "2020-12-10",
  });

  const factura4 = await facturas.create({
    cuenta_id: cuentaC1.get("id"),
    codigo_pago_electronico: "546768754343443",
    numero_factura: "4",
    importe: 1000.0,
    fecha_vencimiento: "2020-12-10",
  });
};

const cargarData = async () => {
  await crearData();
};

const cargarBDConDatosParaTest = async () => {
  await syncDb(true, true);
  await crearData();
};

const obtenerUsuarioDePrueba = () => {
  return usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
};

const obtenerClienteDePrueba = () => {
  return clientes.findOne({
    include: [
      {
        model: usuarios,
        where: { nombre_usuario: "alejandro.otero" },
      },
    ],
  });
};

const obtenerEmpleadoPrueba = () => {
  return empleados.findAll({});
};

module.exports = {
  crearData,
  cargarData,
  obtenerUsuarioDePrueba,
  obtenerClienteDePrueba,
  obtenerEmpleadoPrueba,
  cargarBDConDatosParaTest,
};
