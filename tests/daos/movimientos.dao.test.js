const { CLIENTES_TIPO } = require("../../src/daos/common");
const { depositarDinero } = require("../../src/daos/movimientos.dao");
const { db, syncDb } = require("../../src/sequelize/models");
const { clientes, cuentas } = db;

const crearClientes = async () => {
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
};

beforeAll(async () => {
  await syncDb(true);
  await crearClientes();
});

it("Depositar dinero", () => {
  depositarDinero("123456789", "");
});
