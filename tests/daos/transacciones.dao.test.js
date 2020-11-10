const {
  MOVIMIENTOS_CUENTAS_TIPO,
  MOVIMIENTOS_CUENTAS_CONCEPTO,
} = require("../../src/daos/common");
const {
  ClienteNoExisteError,
  CuentaNoExisteError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
} = require("../../src/daos/errors");
const {
  depositarDineroEnCuenta,
  extraerDineroDeCuenta,
} = require("../../src/daos/transacciones.dao");
const { db, syncDb } = require("../../src/sequelize/models");
const { cuentas, usuarios, movimientos_cuentas, conceptos_movimientos } = db;
const { crearData } = require("../fixtures");

beforeEach(async () => {
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

it("(función) extraer dinero de una cuenta, debe funcionar", async () => {
  const dni = "987654321";
  const numero_cuenta = "904334389865655";
  const cantidad = 8100.32;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await extraerDineroDeCuenta({ numero_cuenta, dni, cantidad, usuario });

  const cuenta = await cuentas.findOne({ where: { numero_cuenta } });
  const movimiento = await movimientos_cuentas.findOne({
    where: { cuenta_id: cuenta.get("id") },
  });
  const concepto = await conceptos_movimientos.findOne({
    where: { alias: MOVIMIENTOS_CUENTAS_CONCEPTO.EXTRACCION },
  });

  expect(cuenta.get("saldo")).toBe((150000.5 - cantidad).toFixed(4));
  expect(movimiento.get("tipo")).toBe(MOVIMIENTOS_CUENTAS_TIPO.DEBITA);
  expect(movimiento.get("concepto_movimiento_id")).toBe(concepto.get("id"));
  expect(movimiento.get("cantidad")).toBe(cantidad.toFixed(4));
});

it("(función) extraer dinero de una cuenta que no existe, debe fallar", async () => {
  const dni = "987654321";
  const numero_cuenta = "123";
  const cantidad = 8100.32;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await expect(
    extraerDineroDeCuenta({ numero_cuenta, dni, cantidad, usuario })
  ).rejects.toEqual(new CuentaNoExisteError());
});

it("(función) extraer dinero de una cuenta cuando el cliente no existe, debe fallar", async () => {
  const dni = "123";
  const numero_cuenta = "904334389865655";
  const cantidad = 8100.32;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await expect(
    extraerDineroDeCuenta({ numero_cuenta, dni, cantidad, usuario })
  ).rejects.toEqual(new ClienteNoExisteError());
});

it("(función) extraer dinero de una cuenta cuando no le pertence al cliente, debe fallar", async () => {
  const dni = "123456789";
  const numero_cuenta = "904334389865655";
  const cantidad = 8100.32;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await expect(
    extraerDineroDeCuenta({ numero_cuenta, dni, cantidad, usuario })
  ).rejects.toEqual(new CuentaNoAsociadaAlClienteError());
});

it("(función) extraer dinero de una cuenta corriente con saldo insuficiente, debe fallar", async () => {
  const dni = "987654321";
  const numero_cuenta = "544323902909083";
  const cantidad = 35001.0;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await expect(
    extraerDineroDeCuenta({ numero_cuenta, dni, cantidad, usuario })
  ).rejects.toEqual(new CuentaConSaldoInsuficienteError());
});

it("(función) extraer dinero de una cuenta caja de ahorro con saldo insuficiente, debe fallar", async () => {
  const dni = "987654321";
  const numero_cuenta = "904334389865655";
  const cantidad = 200000.0;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await expect(
    extraerDineroDeCuenta({ numero_cuenta, dni, cantidad, usuario })
  ).rejects.toEqual(new CuentaConSaldoInsuficienteError());
});
 