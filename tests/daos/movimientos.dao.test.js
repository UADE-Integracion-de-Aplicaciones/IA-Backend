const { CLIENTES_TIPO, CUENTAS_TIPO } = require("../../src/daos/common");
const { depositarDinero } = require("../../src/daos/movimientos.dao");
const { db, syncDb } = require("../../src/sequelize/models");
const { clientes, cuentas, empleados, usuarios, roles } = db;

const crearData = async () => {
  const rol1 = await roles.create({
    descripcion: "Ejecutivo del Banco",
    alias: "EJECUTIVO",
  });

  const usuarioA = await usuarios.create({
    nombre_usuario: "alejandro.otero",
    clave: "123",
    rol_id: rol1.get("id"),
  });
  console.log(usuarioA);
  const empleadoA = await empleados.create({
    nombre: "Alejandro",
    apellido: "Otero",
    fecha_nacimiento: "1998-01-01",
    fecha_ingreso: "2020-01-05",
    cargo: "ejecutivo",
    usuario_id: usuarioA.get("id"),
  });
  console.log(empleadoA);
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
  });

  const cuentaA1 = await cuentas.create({
    cliente_id: clienteA.get("id"),
    tipo: CUENTAS_TIPO.CAJA_DE_AHORRO,
    numero_cuenta: "546565465767643232",
    cbu: "43546565",
    fondo_descubierto: 5000.0,
    saldo: 5000.0,
    empleado_creador_id: empleadoA.get("id"),
  });

  const cuentaB1 = await cuentas.create({
    cliente_id: clienteA.get("id"),
    tipo: CUENTAS_TIPO.CAJA_DE_AHORRO,
    numero_cuenta: "904334389865655",
    cbu: "8756645",
    fondo_descubierto: 9000.0,
    saldo: 150000.5,
    empleado_creador_id: empleadoA.get("id"),
  });
};

beforeAll(async () => {
  await syncDb(true);
  await crearData();
});

it("Depositar dinero", () => {
  depositarDinero("123456789", "");
});
