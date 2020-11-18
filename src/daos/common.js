const CLIENTES_TIPO = {
  PERSONA_FISICA: "PERSONA_FISICA",
  EMPRESA: "EMPRESA",
  PROVEEDOR: "PROVEEDOR",
};

const CUENTAS_TIPO = {
  CAJA_DE_AHORRO: "CAJA_DE_AHORRO",
  CUENTA_CORRIENTE: "CUENTA_CORRIENTE",
};

const MOVIMIENTOS_CUENTAS_CONCEPTO = {
  DEPOSITO: "DEPOSITO",
  EXTRACCION: "EXTRACCION",
  PAGO_A_PROVEEDOR: "PAGO_A_PROVEEDOR",
  PAGO_DE_CLIENTE: "PAGO_DE_CLIENTE",
  COMISION_POR_TRANSACCION: "COMISION_POR_TRANSACCION",
  MANTENIMIENTO_DE_CUENTA: "MANTENIMIENTO_DE_CUENTA",
  FONDO_DESCUBIERTO: "FONDO_DESCUBIERTO",
  DINERO_EN_CUENTA: "DINERO_EN_CUENTA",
};

const MOVIMIENTOS_CUENTAS_TIPO = {
  ACREDITA: "ACREDITA",
  DEBITA: "DEBITA",
};

const NUMERO_UNICO_TIPO = {
  NUMERO_DE_CUENTA: "NUMERO_DE_CUENTA",
  CBU: "CBU",
};

const DEFAULTS = {
  ANTIGUEDAD_CUENTA_PARA_MANTENIMIENTO: {
    valor: "10",
    unidad: "minutes",
  },
  CRON_EJECUCION_TAREAS: "0 0 * * *",
};

const SMTP_CONFIG = {
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: "alexcabezas1@gmail.com",
    pass: "U6NSI9KPQJ13HRhd",
  },
};

const SERVICE_DETAILS = {
  name: "Bankame",
  url: "https://integracion-banco.herokuapp.com/",
  email: "bankame.service@gmail.com",
};

const BANCOS_INFO = {
  BANCO_A: {
    nombre: "BANCO_A",
    servicio_url: "http://www.banco_a.com",
    pedir_dinero_endpoint: "/pedir_dinero",
    token: "UN_TOKEN_DEL_BANCO_A",
  },
};

module.exports = {
  DEFAULTS,
  CLIENTES_TIPO,
  CUENTAS_TIPO,
  MOVIMIENTOS_CUENTAS_CONCEPTO,
  MOVIMIENTOS_CUENTAS_TIPO,
  NUMERO_UNICO_TIPO,
  SMTP_CONFIG,
  SERVICE_DETAILS,
  BANCOS_INFO,
};
