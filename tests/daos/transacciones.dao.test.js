const {
  MOVIMIENTOS_CUENTAS_TIPO,
  MOVIMIENTOS_CUENTAS_CONCEPTO,
} = require("../../src/daos/common");
const {
  ClienteNoExisteError,
  CuentaNoExisteError,
} = require("../../src/daos/errors");
const { depositarDineroEnCuenta } = require("../../src/daos/transacciones.dao");
const { db, syncDb } = require("../../src/sequelize/models");
const { cuentas, usuarios, movimientos_cuentas, conceptos_movimientos } = db;
const { crearData } = require("../fixtures");

beforeAll(async () => {
  await syncDb(true);
  await crearData();
});

it("(función) depositar dinero, debe funcionar", async () => {
  const cbu = "8756645";
  const dni = "123456789";
  const cantidad = 12000;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await depositarDineroEnCuenta({ dni, cbu, usuario, cantidad });

  const cuenta = await cuentas.findOne({ where: { cbu } });
  const movimiento = await movimientos_cuentas.findOne({
    where: { cuenta_id: cuenta.get("id") },
  });
  const concepto = await conceptos_movimientos.findOne({
    where: { alias: MOVIMIENTOS_CUENTAS_CONCEPTO.DEPOSITO },
  });

  expect(cuenta.get("saldo")).toBe((150000.5 + cantidad).toFixed(4));
  expect(movimiento.get("tipo")).toBe(MOVIMIENTOS_CUENTAS_TIPO.ACREDITA);
  expect(movimiento.get("concepto_movimiento_id")).toBe(concepto.get("id"));
  expect(movimiento.get("cantidad")).toBe(cantidad.toFixed(4));
});

it("(función) depositar dinero para un cliente que no existe, debe fallar", async () => {
  const cbu = "8756645";
  const dni = "999";
  const cantidad = 10;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await expect(
    depositarDineroEnCuenta({ dni, cbu, usuario, cantidad })
  ).rejects.toEqual(new ClienteNoExisteError());
});

it("(función) depositar dinero para una cuenta que no existe, debe fallar", async () => {
  const cbu = "87566451";
  const dni = "123456789";
  const cantidad = 10;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await expect(
    depositarDineroEnCuenta({ dni, cbu, usuario, cantidad })
  ).rejects.toEqual(new CuentaNoExisteError());
});
