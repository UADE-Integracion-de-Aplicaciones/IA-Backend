const { db } = require("../sequelize/models");
const {
  cuentas,
  movimientos_cuentas,
  conceptos_movimientos,
  numeros_unicos,
  empleados,
  Sequelize,
} = db;
const { Op } = Sequelize;
const {
  NUMERO_UNICO_TIPO,
  CUENTAS_TIPO,
  SERVICE_DETAILS,
} = require("./common");
const {
  ParametrosFaltantesError,
  DesconocidoBDError,
  TipoDeCuentaInvalidoError,
  LimiteDeCuentasExcedidoError,
} = require("./errors");

const generarNumeroCuenta = () => {
  return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
};

// se genera el CBU según esto: https://es.wikipedia.org/wiki/Clave_Bancaria_Uniforme
const generarCBU = ({ numero_cuenta, numero_sucursal }) => {
  const digitoVerificador1 = SERVICE_DETAILS.codigo_verificador[0].toString();
  const digitoVerificador2 = SERVICE_DETAILS.codigo_verificador[1].toString();
  return SERVICE_DETAILS.numero_entidad
    .concat(numero_sucursal)
    .concat(digitoVerificador1)
    .concat(numero_cuenta)
    .concat(digitoVerificador2);
};

const tomarNumeroUnico = async (usuario_id) => {
  const tipo = NUMERO_UNICO_TIPO.NUMERO_DE_CUENTA;
  const tomado_por = usuario_id;

  const query = `
    UPDATE numeros_unicos
    SET "tomado_por" = '${usuario_id}'
    WHERE id = (
        SELECT id
        FROM numeros_unicos
        WHERE "tipo" = '${tipo}' AND
              "tomado_por" IS NULL
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    ) RETURNING id
  `;

  await db.sequelize.query(query);

  return numeros_unicos.findOne({ where: { tomado_por, tipo } });
};

const asignarNumeroUnico = ({ cuenta, numero_unico }) => {
  const cuenta_id = cuenta.get("id");
  const id = numero_unico.get("id");
  return numeros_unicos.update(
    {
      cuenta_id,
    },
    {
      where: { id },
    }
  );
};

const liberarNumeroUnico = (usuario_id) => {
  const tipo = NUMERO_UNICO_TIPO.NUMERO_DE_CUENTA;
  const tomado_por = usuario_id;
  return numeros_unicos.update(
    {
      tomado_por: null,
    },
    {
      where: { tipo, tomado_por },
    }
  );
};

module.exports = {
  generarNumeroCuenta,
  generarCBU,

  async crear({ tipo, cliente_id, fondo_descubierto, usuario_id }) {
    if (!tipo || !cliente_id || !usuario_id) {
      throw new ParametrosFaltantesError();
    }

    if (!Object.keys(CUENTAS_TIPO).includes(tipo)) {
      throw new TipoDeCuentaInvalidoError();
    }
    //TODO: validar fondo_descubierto cuando sea cuenta corriente

    const existeCuenta = await cuentas.findOne({ where: { tipo, cliente_id } });
    if (existeCuenta) {
      throw new LimiteDeCuentasExcedidoError();
    }

    const empleado = await empleados.findOne({ where: { usuario_id } });
    const empleado_creador_id = empleado.get("id");

    let cuenta;
    try {
      const numero_unico = await tomarNumeroUnico(usuario_id);
      const numero_cuenta = numero_unico.get("numero");
      const { numero_sucursal_por_defecto: numero_sucursal } = SERVICE_DETAILS;
      const cbu = generarCBU({ numero_cuenta, numero_sucursal });

      cuenta = await cuentas.create({
        tipo,
        cliente_id,
        numero_cuenta,
        cbu,
        fondo_descubierto,
        saldo: 0,
        empleado_creador_id,
      });

      await asignarNumeroUnico({ cuenta, numero_unico });
    } catch (error) {
      console.log(error);
      await liberarNumeroUnico(empleado_creador_id);
      throw new DesconocidoBDError(error);
    }

    return cuenta;
  },

  obtenerCuentas(cliente) {
    if (!cliente) {
      throw new ParametrosFaltantesError();
    }

    const cliente_id = cliente.get("id");

    return cuentas.findAll({ where: { cliente_id } });
  },

  obtenerCantidadDeCuentasPorCliente(cliente) {
    const cliente_id = cliente.get("id");
    return cuentas.count({ where: { cliente_id } });
  },

  obtenerCuenta(numero_cuenta) {
    return cuentas.findOne({ where: { numero_cuenta } });
  },
  // Retorna la cuentas
  async getcuentas(payload) {
    const cuentas = this.buscarcuentas(payload);
    return cuentas;
  },

  async getSaldo(payload) {
    const cuenta = await this.buscarcuentas(payload);
    //let saldo = cuentas.findAll({ attributes: 'saldo'})
    return cuenta.saldo;
  },

  // Por ahora devuelve todos los movimientos con ese ID
  // Habria que mockear como vamos a devolver el resumen
  async getResumencuentas(payload) {
    const cuentas = this.buscarcuentas(payload);
    return movimientos_cuentas.findAll({
      where: {
        cuentas_id: cuentas.id,
      },
    });
  },

  //Recibe el payload (body del req) y chequea si tiene numero de cuentas o cbu
  buscarcuentas(payload) {
    console.log(payload);
    if (payload.numero_cuenta)
      return this.getcuentasByNumerocuentas(payload.numero_cuenta);
    else if (payload.cbu) return this.getcuentasByCBU(payload.cbu);
    throw Error("No se encontro un campo valido");
  },

  async obtenerCuentaConMovimientos(numero_cuenta) {
    const cuenta = await cuentas.findOne({
      where: {
        numero_cuenta: numero_cuenta,
      },
    });
    const cuenta_id = cuenta.get("id");
    const movimientos_cuenta = await movimientos_cuentas.findAll({
      where: { cuenta_id },
      include: [{ model: conceptos_movimientos }],
    });
    return { cuenta, movimientos_cuenta };
  },

  getcuentasByCBU(cbu) {
    return cuentas.findOne({
      where: {
        cbu: cbu,
      },
    });
  },
};
