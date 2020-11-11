const {
  MOVIMIENTOS_CUENTAS_TIPO,
  MOVIMIENTOS_CUENTAS_CONCEPTO,
} = require("../../src/daos/common");
const {
  ClienteNoExisteError,
  CuentaNoExisteError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
  CantidadMenorQueTotalFacturasError,
  CantidadMayorQueTotalFacturasError,
} = require("../../src/daos/errors");
const {
  extraerDineroDeCuenta,
  depositarEnCuentaPropia,
  depositarEnCuentaDeTercero,
  pagarServicioComoCliente,
  pagarServicioComoBanco,
} = require("../../src/daos/transacciones.dao");
const { buscarFacturasPorCodigo } = require("../../src/daos/facturas.dao");
const { db, syncDb } = require("../../src/sequelize/models");
const { cuentas, usuarios, movimientos_cuentas, conceptos_movimientos } = db;
const { crearData } = require("../fixtures");

beforeEach(async () => {
  await syncDb(true);
  await crearData();
});

it("(función) depositar dinero en cuenta propia, debe funcionar", async () => {
  const numero_cuenta = "904334389865655";
  const dni = "123456789";
  const cantidad = 12000;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await depositarEnCuentaPropia(numero_cuenta)({ dni, usuario, cantidad });

  const cuenta = await cuentas.findOne({ where: { numero_cuenta } });
  const movimiento = await movimientos_cuentas.findOne({
    where: { cuenta_id: cuenta.get("id") },
  });
  const concepto = await conceptos_movimientos.findOne({
    where: { alias: MOVIMIENTOS_CUENTAS_CONCEPTO.DEPOSITO },
  });

  expect(parseFloat(cuenta.get("saldo"))).toBe(150000.5 + cantidad);
  expect(movimiento.get("tipo")).toBe(MOVIMIENTOS_CUENTAS_TIPO.ACREDITA);
  expect(movimiento.get("concepto_movimiento_id")).toBe(concepto.get("id"));
  expect(parseFloat(movimiento.get("cantidad"))).toBe(cantidad);
});

it("(función) depositar dinero en cuenta propia de un cliente que no existe, debe fallar", async () => {
  const numero_cuenta = "904334389865655";
  const dni = "999";
  const cantidad = 10;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await expect(
    depositarEnCuentaPropia(numero_cuenta)({
      dni,
      usuario,
      cantidad,
    })
  ).rejects.toEqual(new ClienteNoExisteError());
});

it("(función) depositar dinero en cuenta propia y en una cuenta que no existe, debe fallar", async () => {
  const numero_cuenta = "9043343898656551";
  const dni = "123456789";
  const cantidad = 10;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await expect(
    depositarEnCuentaPropia(numero_cuenta)({
      dni,
      usuario,
      cantidad,
    })
  ).rejects.toEqual(new CuentaNoExisteError());
});

it("(función) depositar dinero en cuenta de tercero, debe funcionar", async () => {
  const cbu = "54656322";
  const dni = "123456789";
  const cantidad = 12000;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await depositarEnCuentaDeTercero(cbu)({ usuario, cantidad, dni });

  const cuenta = await cuentas.findOne({ where: { cbu } });
  const movimiento = await movimientos_cuentas.findOne({
    where: { cuenta_id: cuenta.get("id") },
  });
  const concepto = await conceptos_movimientos.findOne({
    where: { alias: MOVIMIENTOS_CUENTAS_CONCEPTO.DEPOSITO },
  });

  expect(parseFloat(cuenta.get("saldo"))).toBe(30000 + cantidad);
  expect(movimiento.get("tipo")).toBe(MOVIMIENTOS_CUENTAS_TIPO.ACREDITA);
  expect(movimiento.get("concepto_movimiento_id")).toBe(concepto.get("id"));
  expect(parseFloat(movimiento.get("cantidad"))).toBe(cantidad);
});

it("(función) depositar dinero en cuenta de tercero, debe fallar", async () => {
  const cbu = "546563221";
  const dni = "999";
  const cantidad = 10;
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });
  await expect(
    depositarEnCuentaDeTercero(cbu)({ usuario, cantidad, dni })
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

  expect(parseFloat(cuenta.get("saldo"))).toBe(150000.5 - cantidad);
  expect(movimiento.get("tipo")).toBe(MOVIMIENTOS_CUENTAS_TIPO.DEBITA);
  expect(movimiento.get("concepto_movimiento_id")).toBe(concepto.get("id"));
  expect(parseFloat(movimiento.get("cantidad"))).toBe(cantidad);
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

it("(función) pagar servicio como cliente, debe funcionar", async () => {
  const numero_cuenta = "546565465767643232";
  const facturas = await buscarFacturasPorCodigo("345653312325464");
  const cantidad = facturas.reduce(
    (suma, factura) => suma + parseFloat(factura.get("importe")),
    0.0
  );
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await pagarServicioComoCliente({
    facturas,
    numero_cuenta,
    cantidad,
    usuario,
  });

  //verificar saldo de cuenta origen
  const cuenta_origen = await cuentas.findOne({ where: { numero_cuenta } });
  expect(parseFloat(cuenta_origen.get("saldo"))).toBe(5000.0 - cantidad);
  //verificar saldo cuenta de destino
  const cuenta_destino = await facturas[0].getCuenta();
  expect(parseFloat(cuenta_destino.get("saldo"))).toBe(100.0 + cantidad);
  //revisar los movimientos, uno para debitar y otro para acreditar
  const concepto_pago_proveedor = await conceptos_movimientos.findOne({
    where: { alias: MOVIMIENTOS_CUENTAS_CONCEPTO.PAGO_A_PROVEEDOR },
  });
  const movimiento_debito = await movimientos_cuentas.findOne({
    where: {
      cuenta_id: cuenta_origen.get("id"),
      concepto_movimiento_id: concepto_pago_proveedor.get("id"),
      tipo: MOVIMIENTOS_CUENTAS_TIPO.DEBITA,
    },
  });
  expect(parseFloat(movimiento_debito.get("cantidad"))).toBe(cantidad);

  const concepto_pago_cliente = await conceptos_movimientos.findOne({
    where: { alias: MOVIMIENTOS_CUENTAS_CONCEPTO.PAGO_DE_CLIENTE },
  });
  const movimiento_credito = await movimientos_cuentas.findOne({
    where: {
      cuenta_id: cuenta_destino.get("id"),
      concepto_movimiento_id: concepto_pago_cliente.get("id"),
      tipo: MOVIMIENTOS_CUENTAS_TIPO.ACREDITA,
    },
  });
  expect(parseFloat(movimiento_credito.get("cantidad"))).toBe(cantidad);
});

it("(función) pagar servicio como cliente con una cuenta que no existe, debe fallar", async () => {
  const numero_cuenta = "5465654657676432321";
  const facturas = await buscarFacturasPorCodigo("345653312325464");
  const cantidad = facturas.reduce(
    (suma, factura) => suma + parseFloat(factura.get("importe")),
    0.0
  );
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await expect(
    pagarServicioComoCliente({ facturas, numero_cuenta, cantidad, usuario })
  ).rejects.toEqual(new CuentaNoExisteError());
});

it("(función) pagar servicio como cliente con una cuenta con saldo insuficiente, debe fallar", async () => {
  const numero_cuenta = "76065842338329221";
  const facturas = await buscarFacturasPorCodigo("345653312325464");
  const cantidad = facturas.reduce(
    (suma, factura) => suma + parseFloat(factura.get("importe")),
    0.0
  );
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await expect(
    pagarServicioComoCliente({ facturas, numero_cuenta, cantidad, usuario })
  ).rejects.toEqual(new CuentaConSaldoInsuficienteError());
});

it("(función) pagar servicio como cliente con una cantidad menor al importe total de las facturas, debe fallar", async () => {
  const numero_cuenta = "546565465767643232";
  const facturas = await buscarFacturasPorCodigo("345653312325464");
  const cantidad = facturas.reduce(
    (suma, factura) => suma + parseFloat(factura.get("importe")),
    -10.0
  );
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await expect(
    pagarServicioComoCliente({ facturas, numero_cuenta, cantidad, usuario })
  ).rejects.toEqual(new CantidadMenorQueTotalFacturasError());
});

it("(función) pagar servicio como cliente con una cantidad mayor al importe total de las facturas, debe fallar", async () => {
  const numero_cuenta = "546565465767643232";
  const facturas = await buscarFacturasPorCodigo("345653312325464");
  const cantidad = facturas.reduce(
    (suma, factura) => suma + parseFloat(factura.get("importe")),
    10.0
  );
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await expect(
    pagarServicioComoCliente({ facturas, numero_cuenta, cantidad, usuario })
  ).rejects.toEqual(new CantidadMayorQueTotalFacturasError());
});

it("(función) pagar servicio como ejecutivo del banco cuando el cliente no existe, debe fallar", async () => {
  const dni = "999999999999";
  const numero_cuenta = "546565465767643232";
  const facturas = await buscarFacturasPorCodigo("345653312325464");
  const cantidad = facturas.reduce(
    (suma, factura) => suma + parseFloat(factura.get("importe")),
    10.0
  );
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await expect(
    pagarServicioComoBanco(dni)({ facturas, numero_cuenta, cantidad, usuario })
  ).rejects.toEqual(new ClienteNoExisteError());
});

it("(función) pagar servicio como ejecutivo del banco con una cuenta no asociada al cliente, debe fallar", async () => {
  const dni = "987654321";
  const numero_cuenta = "546565465767643232";
  const facturas = await buscarFacturasPorCodigo("345653312325464");
  const cantidad = facturas.reduce(
    (suma, factura) => suma + parseFloat(factura.get("importe")),
    10.0
  );
  const usuario = await usuarios.findOne({
    where: { nombre_usuario: "alejandro.otero" },
  });

  await expect(
    pagarServicioComoBanco(dni)({ facturas, numero_cuenta, cantidad, usuario })
  ).rejects.toEqual(new CuentaNoAsociadaAlClienteError());
});
