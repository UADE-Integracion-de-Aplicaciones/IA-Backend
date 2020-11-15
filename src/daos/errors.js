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
  static message =
    "no existe factura asociada a ese codigo electronico o a ese numero de factura";
  constructor() {
    super(FacturaNoExisteError.message);
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
  static message = "el archivo esta vacio";
  constructor() {
    super(ArchivoVacioError.message);
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
  static message = "el codigo proporcionado es incorrecto";
  constructor() {
    super(CodigoPagoElectronicoNoExisteError.message);
    this.name = "CodigoPagoElectronicoNoExisteError";
  }
}

class NumeroFacturaNoExisteError extends Error {
  static message = "el numero de factura es incorrecto";
  constructor() {
    super(NumeroFacturaNoExisteError.message);
    this.name = "NumeroFacturaNoExisteError";
  }
}

class CodigoDeAutorizacionInvalidoError extends Error {
  static mensage = "código de autorización inválido";
  constructor() {
    super(CodigoDeAutorizacionInvalidoError.mensage);
    this.nombre = "CodigoDeAutorizacionInvalidoError";
  }
}

class ParametrosFaltantesError extends Error {
  static mensage = "código de autorización inválido";
  constructor() {
    super(ParametrosFaltantesError.mensage);
    this.nombre = "ParametrosFaltantesError";
  }
}

class NombreUsuarioNoDisponibleError extends Error {
  static mensage = "este usuario no existe";
  constructor() {
    super(NombreUsuarioNoDisponibleError.mensage);
    this.nombre = "NombreUsuarioNoDisponibleError";
  }
}

class TipoDeClienteInvalidoError extends Error {
  static mensage = "tipo de cliente inválido";
  constructor() {
    super(TipoDeClienteInvalidoError.mensage);
    this.nombre = "TipoDeClienteInvalidoError";
  }
}

class DniNoDisponible extends Error {
  static mensage = "este dni ya existe en el sistema";
  constructor() {
    super(DniNoDisponible.mensage);
    this.nombre = "DniNoDisponible";
  }
}

class CuitNoDisponible extends Error {
  static mensage = "este cuit ya existe en el sistema";
  constructor() {
    super(CuitNoDisponible.mensage);
    this.nombre = "CuitNoDisponible";
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
};
