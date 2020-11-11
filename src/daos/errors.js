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

class CuentaNoExisteError extends Error {
  static mensaje = "la cuenta no existe o no está activa";
  constructor() {
    super(CuentaNoExisteError.mensaje);
    this.nombre = "CuentaNoExisteError";
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

module.exports = {
  DesconocidoBDError,
  DesconocidoError,
  ClienteNoExisteError,
  CuentaNoExisteError,
  CantidadInvalidaError,
  CuentaNoAsociadaAlClienteError,
  CuentaConSaldoInsuficienteError,
  CantidadMenorQueTotalFacturasError,
  CantidadMayorQueTotalFacturasError,
};
