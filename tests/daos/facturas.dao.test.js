/* const {
    CodigoPagoElectronicoNoExisteError, 
    FacturaNoExisteError,
    NumeroFacturaNoExisteError
  } = require("../../src/daos/errors");
const {
    cargarFacturas, getFacturaByNumeroFactura,getFacturaByCodigoPagoElectronico
  } = require("../../src/daos/facturas.dao");
  const { db, syncDb } = require("../../src/sequelize/models");
  const { cuentas, facturas, clientes } = db;
  const { crearData } = require("../fixtures");
  
  beforeEach(async () => {
    await syncDb(true);
    await crearData();
  });

  it("(función) crear facturas a partir de un archivo csv, debe funcionar", async () => {
    const cliente = await clientes.findOne({
      where: { cuit: "2098684014" },
    });
    const cliente_id = cliente.get("id");
    const cuenta = await cuentas.findOne({
        where: { cliente_id },
    });
    const cuenta_id = cuenta.get("id")
    const numero_cuenta = cuenta.get("numero_cuenta")
    const archivo = '../../tests/fixtures/csvEjemplo.csv'
    
    await cargarFacturas(archivo, numero_cuenta);
  
    const factura = await facturas.findOne({
        where: { cuenta_id } 
    })

    expect(factura).toBe(await facturas.findOne({ where: {cuenta_id}}));
  });

  it("(función) crear facturas a partir de un archivo text, debe fallar", async () => {
    const cliente = await clientes.findOne({
      where: { cuit: "2098684014" },
    });
    const cliente_id = cliente.get('id');
    const cuenta = await cuentas.findOne({
        where: { cliente_id },
    });
    const cuenta_id = cuenta.get("id")
    const numero_cuenta = cuenta.get("numero_cuenta")
    const archivo = '../../tests/fixtures/csvEjemploText.txt'
    
    await cargarFacturas(archivo, numero_cuenta);
    
    const factura = await facturas.findOne({
        where: { cuenta_id } 
    })

    await expect(
        getFacturaByNumeroFactura(factura.get('numero_factura'))
      ).toBe(null);
  });

  it("(función) buscar una factura por codigo pago electronico o numero de factura debe funcionar", async () => {
    const factura = await facturas.findOne({
        where: { numero_factura: "0912390435812"  } 
    })
    expect(getFacturaByNumeroFactura(factura.get('numero_factura'))).toBe("0912390435812");
    expect(getFacturaByCodigoPagoElectronico(factura.get('codigo_pago_electronico'))).toBe("123542130");   
  });

  it("(función) buscar una factura por codigo pago electronico o numero de factura debe fallar", async () => {
    const buscarNumeroFactura = "12312354"
    await expect(
        getFacturaByNumeroFactura(buscarNumeroFactura)
      ).rejects.toEqual(new NumeroFacturaNoExisteError());
  });

  it("(función) buscar una factura por codigo pago electronico o numero de factura debe fallar", async () => {
    const buscarCodigoPagoElectronico = "12312543"
    expect(getFacturaByCodigoPagoElectronico(buscarCodigoPagoElectronico)).toBe(new CodigoPagoElectronicoNoExisteError());
  }); */