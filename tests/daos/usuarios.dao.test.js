const bcrypt = require("bcrypt");
const { db, syncDb } = require("../../src/sequelize/models");
const { roles, usuarios } = db;
const { crearData } = require("../fixtures");

beforeEach(async () => {
  await syncDb(true, true);
  await crearData();
});

const { getUserByUserName, registrar } = require("../../src/daos/usuarios.dao");

it("(función) Obtener usuario.", async () => {
  const nombre_usuario = "alejandro.otero";
  let usuario = await getUserByUserName(nombre_usuario);

  expect(usuario.get("nombre_usuario")).toBe(nombre_usuario);
});

fit("(función) Registrar usuario.", async () => {
  const rol1 = await roles.findOne({ where: { alias: "BANCO_EJECUTIVO" } });
  const nombre_usuario = "usuario123";
  const clave = "clave123";
  const rol_id = await rol1.get("id");
  const clave_cifrado = await bcrypt.hash(clave, 8);

  await registrar({ nombre_usuario, clave: clave_cifrado, rol_id });

  const usuario = await usuarios.findOne({
    where: { nombre_usuario: nombre_usuario },
  });
  expect(usuario.get("nombre_usuario")).toBe(nombre_usuario);
  expect(usuario.get("clave")).toBe(clave_cifrado);
  expect(usuario.get("rol_id")).toBe(rol_id);
});
