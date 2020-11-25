const { CUENTAS_TIPO, CLIENTES_TIPO } = require("./common");

const clientes_tipos = Object.keys(CLIENTES_TIPO);
const cuentas_tipos = Object.keys(CUENTAS_TIPO);
class Error {
  constructor(mensaje) {
    this.mensaje = mensaje;
    this.nombre = "Error";
  }
}

class DesconocidoError extends Error {
  static mensaje = "algo anduvo mal";
  constructor() {
    super(DesconocidoError.mensaje);
    this.nombre = "DesconocidoError";
  }
}

class DesconocidoBDError extends Error {
  static mensaje = "algo anduvo mal";
  constructor() {
    super(DesconocidoBDError.mensaje);
    this.nombre = "DesconocidoBDError";
  }
}

class ClienteNoExisteError extends Error {
  static mensaje = "el cliente no existe o no está activo";
  constructor() {
    super(ClienteNoExisteError.mensaje);
    this.nombre = "ClienteNoExisteError";
  }
}

class FacturaNoExisteError extends Error {
  static mensaje =
    "no existe factura asociada a ese codigo electronico o a ese numero de factura";
  constructor() {
    super(FacturaNoExisteError.mensaje);
    this.name = "FacturaNoExisteError";
  }
}

class CuentaNoExisteError extends Error {
  static mensaje = "la cuenta no existe o no está activa";
  constructor() {
    super(CuentaNoExisteError.mensaje);
    this.nombre = "CuentaNoExisteError";
  }
}

class ArchivoVacioError extends Error {
  static mensaje = "el archivo esta vacio";
  constructor() {
    super(ArchivoVacioError.mensaje);
    this.name = "ArchivoVacioError";
  }
}

class CantidadInvalidaError extends Error {
  static mensaje = "cantidad de dinero es inválida";
  constructor() {
    super(CantidadInvalidaError.mensaje);
    this.nombre = "CantidadInvalidaError";
  }
}

class CuentaNoAsociadaAlClienteError extends Error {
  static mensaje = "cuenta inválida";
  constructor() {
    super(CuentaNoAsociadaAlClienteError.mensaje);
    this.nombre = "CuentaNoAsociadaAlClienteError";
  }
}

class CuentaConSaldoInsuficienteError extends Error {
  static mensaje = "cuenta con saldo insuficiente";
  constructor() {
    super(CuentaConSaldoInsuficienteError.mensaje);
    this.nombre = "CuentaConSaldoInsuficienteError";
  }
}

class CantidadMenorQueTotalFacturasError extends Error {
  static mensaje = "la cantidad es menor que el importe total de las facturas";
  constructor() {
    super(CantidadMenorQueTotalFacturasError.mensaje);
    this.nombre = "CantidadMenorQueTotalFacturasError";
  }
}

class CantidadMayorQueTotalFacturasError extends Error {
  static mensaje = "la cantidad es mayor que el importe total de las facturas";
  constructor() {
    super(CantidadMayorQueTotalFacturasError.mensaje);
    this.nombre = "CantidadMayorQueTotalFacturasError";
  }
}

class CodigoPagoElectronicoNoExisteError extends Error {
  static mensaje = "el codigo proporcionado es incorrecto";
  constructor() {
    super(CodigoPagoElectronicoNoExisteError.mensaje);
    this.name = "CodigoPagoElectronicoNoExisteError";
  }
}

class NumeroFacturaNoExisteError extends Error {
  static mensaje = "el numero de factura es incorrecto";
  constructor() {
    super(NumeroFacturaNoExisteError.mensaje);
    this.name = "NumeroFacturaNoExisteError";
  }
}

class CodigoDeAutorizacionInvalidoError extends Error {
  static mensaje = "código de autorización inválido";
  constructor() {
    super(CodigoDeAutorizacionInvalidoError.mensaje);
    this.nombre = "CodigoDeAutorizacionInvalidoError";
  }
}

class ParametrosFaltantesError extends Error {
  static mensaje = "parametros insuficientes";
  constructor() {
    super(ParametrosFaltantesError.mensaje);
    this.nombre = "ParametrosFaltantesError";
  }
}

class NombreUsuarioNoDisponibleError extends Error {
  static mensaje = "este usuario no existe";
  constructor() {
    super(NombreUsuarioNoDisponibleError.mensaje);
    this.nombre = "NombreUsuarioNoDisponibleError";
  }
}

class UsuarioNoExisteError extends Error {
  static mensaje = "este usuario no usuario no existe";
  constructor() {
    super(UsuarioNoExisteError.mensaje);
    this.nombre = "UsuarioNoExisteError";
  }
}
class TipoDeClienteInvalidoError extends Error {
  static mensaje = `tipo de cliente inválido (${clientes_tipos.join(", ")})`;
  constructor() {
    super(TipoDeClienteInvalidoError.mensaje);
    this.nombre = "TipoDeClienteInvalidoError";
  }
}

class TipoDeCuentaInvalidoError extends Error {
  static mensaje = `tipo de cuenta inválido (${cuentas_tipos.join(", ")})`;
  constructor() {
    super(TipoDeCuentaInvalidoError.mensaje);
    this.nombre = "TipoDeCuentaInvalidoError";
  }
}

class DniNoDisponible extends Error {
  static mensaje = "este dni ya existe en el sistema";
  constructor() {
    super(DniNoDisponible.mensaje);
    this.nombre = "DniNoDisponible";
  }
}

class CuitNoDisponible extends Error {
  static mensaje = "este cuit ya existe en el sistema";
  constructor() {
    super(CuitNoDisponible.mensaje);
    this.nombre = "CuitNoDisponible";
  }
}

class LimiteDeCuentasExcedidoError extends Error {
  static mensaje = "el cliente ya posee una cuenta de este tipo";
  constructor() {
    super(LimiteDeCuentasExcedidoError.mensaje);
    this.nombre = "LimiteDeCuentasExcedidoError";
  }
}

class DescripcionDeMovimientoIndalidaError extends Error {
  static mensaje = "la descripción del movimiento es inválida";
  constructor() {
    super(DescripcionDeMovimientoIndalidaError.mensaje);
    this.nombre = "DescripcionDeMovimientoIndalidaError";
  }
}

class TokenInvalidoError extends Error {
  static mensaje = "token invalido";
  constructor() {
    super(TokenInvalidoError.mensaje);
    this.nombre = "TokenInvalidoError";
  }
}

class CuentaOrigenNoExisteError extends Error {
  static mensaje = "la cuenta de origen no existe o no está activa";
  constructor() {
    super(CuentaOrigenNoExisteError.mensaje);
    this.nombre = "CuentaOrigenNoExisteError";
  }
}

class CuentaDestinoNoExisteError extends Error {
  static mensaje = "la cuenta de destino no existe o no está activa";
  constructor() {
    super(CuentaDestinoNoExisteError.mensaje);
    this.nombre = "CuentaDestinoNoExisteError";
  }
}

class FacturasNoExistenError extends Error {
  static mensaje = "las facturas no existen";
  constructor() {
    super(FacturasNoExistenError.mensaje);
    this.nombre = "FacturasNoExistenError";
  }
}

class ConceptoInvalidoError extends Error {
  static mensaje = "concepto inválido";
  constructor() {
    super(ConceptoInvalidoError.mensaje);
    this.nombre = "ConceptoInvalidoError";
  }
}

class OperacionInvalidaError extends Error {
  static mensaje = "operación inválido";
  constructor() {
    super(OperacionInvalidaError.mensaje);
    this.nombre = "OperacionInvalidaError";
  }
}

class ArchivoConFormatoInvalidoError extends Error {
  static mensaje = "archivo con formato inválido";
  constructor() {
    super(ArchivoConFormatoInvalidoError.mensaje);
    this.nombre = "ArchivoConFormatoInvalidoError";
  }
}

class LlamadaFallidaError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.nombre = "LlamadaFallidaError";
  }
}

module.exports = {
  Error,
  DesconocidoBDError,
  DesconocidoError,
  ClienteNoExisteError,
  CuentaNoExisteError,
  CantidadInvalidaError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
  CantidadMenorQueTotalFacturasError,
  CantidadMayorQueTotalFacturasError,
  ArchivoVacioError,
  FacturaNoExisteError,
  CodigoPagoElectronicoNoExisteError,
  NumeroFacturaNoExisteError,
  CodigoDeAutorizacionInvalidoError,
  ParametrosFaltantesError,
  NombreUsuarioNoDisponibleError,
  TipoDeClienteInvalidoError,
  DniNoDisponible,
  CuitNoDisponible,
  TipoDeCuentaInvalidoError,
  LimiteDeCuentasExcedidoError,
  UsuarioNoExisteError,
  DescripcionDeMovimientoIndalidaError,
  TokenInvalidoError,
  CuentaOrigenNoExisteError,
  CuentaDestinoNoExisteError,
  FacturasNoExistenError,
  ConceptoInvalidoError,
  OperacionInvalidaError,
  ArchivoConFormatoInvalidoError,
  LlamadaFallidaError,
};
