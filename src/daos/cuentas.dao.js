const { db } = require("../sequelize/models");
const {
  cuentas,
  movimientos_cuentas,
  numeros_unicos,
  empleados,
  Sequelize,
} = db;
const { Op } = Sequelize;
const { NUMERO_UNICO_TIPO, CUENTAS_TIPO } = require("./common");
const {
  ParametrosFaltantesError,
  DesconocidoBDError,
  TipoDeCuentaInvalidoError,
  LimiteDeCuentasExcedidoError,
} = require("./errors");

// se genera un numero de cuentas random de 13 digitos
const generarNumeroCuenta = () => {
  let numero = Math.floor(
    1000000000000 + Math.random() * 9000000000000
  ).toString();
  return numero;
};

// se genera el CBU con el numero random de la cuentas y con las otras especificaciones de un CBU
const generarCBU = (numero_cuenta) => {
  let numeroBanco = "001";
  let numeroSucursal = "0001";
  let digitoVerificador7 = Math.floor(1 + Math.random() * 9).toString();
  let digitoVerificador13 = Math.floor(1 + Math.random() * 9).toString();
  let cbu = numeroBanco
    .concat(numeroSucursal)
    .concat(digitoVerificador7)
    .concat(numero_cuenta)
    .concat(digitoVerificador13);
  return cbu;
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

  async crear({ tipo, cliente_id, fondo_descubierto, usuario_id }) {
    if (!tipo || !cliente_id || !usuario_id) {
      throw new ParametrosFaltantesError();
    }

    if (!Object.keys(CUENTAS_TIPO).includes(tipo)) {
      throw new TipoDeCuentaInvalidoError();
    }

    const existeCuenta = await cuentas.findOne({ where: { tipo, cliente_id } });
    if (existeCuenta) {
      throw new LimiteDeCuentasExcedidoError();
    }

    const empleado = await empleados.findOne({ where: { usuario_id } });
    const empleado_creador_id = empleado.get("id");

    try {
      const numero_unico = await tomarNumeroUnico(usuario_id);
      const numero_cuenta = numero_unico.get("numero");
      const cbu = generarCBU(numero_cuenta);

      const cuenta = await cuentas.create({
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
  },

  obtenerCuentas(cliente) {
    if (!cliente) {
      throw new ParametrosFaltantesError();
    }

    const cliente_id = cliente.get("id");

    return cuentas.findAll({ where: { cliente_id } });
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

  getcuentasByNumerocuentas(numero_cuenta) {
    return cuentas.findOne({
      where: {
        numero_cuenta: numero_cuenta,
      },
      include: [
        {
          model: movimientos_cuentas,
        },
      ],
    });
  },

  getcuentasByCBU(cbu) {
    return cuentas.findOne({
      where: {
        cbu: cbu,
      },
    });
  },
};