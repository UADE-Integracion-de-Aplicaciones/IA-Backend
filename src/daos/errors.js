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

class CuentaNoExisteError extends Error {
  static message = "la cuenta no existe o no está activa";
  constructor() {
    super(CuentaNoExisteError.message);
    this.name = "CuentaNoExisteError";
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

module.exports = {
  DesconocidoError,
  ClienteNoExisteError,
  CuentaNoExisteError,
  CantidadInvalidaError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
};
