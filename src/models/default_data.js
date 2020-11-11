module.exports = (db) => {
  const { conceptos_movimientos } = db;

  const conceptos = [
    {
      alias: "DEPOSITO",
      descripcion: "Deposito",
    },
    {
      alias: "EXTRACCION",
      descripcion: "Extracción",
    },
    {
      alias: "PAGO_A_PROVEEDOR",
      descripcion: "Pago a Proveedor",
    },
    {
      alias: "PAGO_DE_CLIENTE",
      descripcion: "Pago de Cliente",
    },
    {
      alias: "COMISION_POR_TRANSACCION",
      descripcion: "Comisión por Transacción",
    },
    {
      alias: "MANTENIMIENTO_DE_CUENTA",
      descripcion: "Mantenimiento de Cuenta",
    },
    {
      alias: "FONDO_DESCUBIERTO",
      descripcion: "Fondo Descubierto",
    },
    {
      alias: "DINERO_EN_CUENTA",
      descripcion: "Dinero En Cuenta",
    },
  ];

  const conceptosPromises = conceptos.map((data) =>
    conceptos_movimientos.create(data)
  );

  return Promise.all(conceptosPromises);
};
