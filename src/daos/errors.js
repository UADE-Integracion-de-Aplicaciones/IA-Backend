class Error {
  constructor(message) {
    this.message = message;
    this.name = "Error";
  }
}

class DesconocidoError extends Error {
  static message = "algo anduvo mal";
  constructor() {
    super(DesconocidoError.message);
    this.name = "DesconocidoError";
  }
}

class ClienteNoExisteError extends Error {
  static message = "el cliente no existe o no está activo";
  constructor() {
    super(ClienteNoExisteError.message);
    this.name = "ClienteNoExisteError";
  }
}

class FacturaNoExisteError extends Error {
  static message = "no existe factura asociada a ese codigo electronico o a ese numero de factura";
  constructor() {
    super(FacturaNoExisteError.message);
    this.name = "FacturaNoExisteError";
  }
}

class CuentaNoExisteError extends Error {
  static message = "la cuenta no existe o no está activa";
  constructor() {
    super(CuentaNoExisteError.message);
    this.name = "CuentaNoExisteError";
  }
}

class ArchivoVacio extends Error {
  static message = "el archivo esta vacio";
  constructor() {
    super(ArchivoVacio.message);
    this.name = "ArchivoVacioError";
  }
}

class CantidadInvalidaError extends Error {
  static message = "cantidad de dinero es inválida";
  constructor() {
    super(CantidadInvalidaError.message);
    this.name = "CantidadInvalidaError";
  }
}

class CuentaNoAsociadaAlClienteError extends Error {
  static message = "cuenta inválida";
  constructor() {
    super(CuentaNoAsociadaAlClienteError.message);
    this.name = "CuentaNoAsociadaAlClienteError";
  }
}

class CuentaConSaldoInsuficienteError extends Error {
  static message = "cuenta con saldo insuficiente";
  constructor() {
    super(CuentaConSaldoInsuficienteError.message);
    this.name = "CuentaConSaldoInsuficienteError";
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


module.exports = {
  DesconocidoError,
  ClienteNoExisteError,
  CuentaNoExisteError,
  CantidadInvalidaError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
  ArchivoVacio,
  FacturaNoExisteError,
  CodigoPagoElectronicoNoExisteError,
  NumeroFacturaNoExisteError,
};
