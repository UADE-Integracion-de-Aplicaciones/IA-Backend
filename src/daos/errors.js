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

module.exports = {
  DesconocidoError,
  ClienteNoExisteError,
  CuentaNoExisteError,
};
