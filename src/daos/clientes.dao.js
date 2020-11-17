const { db } = require("../sequelize/models");
const { clientes, cuentas, usuarios } = db;
const { CLIENTES_TIPO } = require("../daos/common");
const { ClienteNoExisteError, DesconocidoBDError } = require("./errors");
const {
  TipoDeClienteInvalidoError,
  DniNoDisponible,
  CuitNoDisponible,
} = require("./errors");

module.exports = {
  async crear({
    tipo,
    cuit,
    dni,
    nombre,
    apellido,
    email,
    domicilio_barrio,
    domicilio_calle,
    domicilio_ciudad,
    domicilio_numero,
    domicilio_piso,
    domicilio_apartamento,
    fecha_nacimiento,
    pregunta1,
    pregunta1_respuesta,
    pregunta2,
    pregunta2_respuesta,
    pregunta3,
    pregunta3_respuesta,
  }) {
    if (!Object.keys(CLIENTES_TIPO).includes(tipo)) {
      throw new TipoDeClienteInvalidoError();
    }

    const existeDNI = await clientes.findOne({ where: { dni } });
    if (existeDNI) {
      throw new DniNoDisponible();
    }

    const existeCUIT = await clientes.findOne({ where: { cuit } });
    if (existeCUIT) {
      throw new CuitNoDisponible();
    }

    return clientes.create({
      tipo,
      cuit,
      dni,
      nombre,
      apellido,
      email,
      domicilio_ciudad,
      domicilio_calle,
      domicilio_barrio,
      domicilio_numero,
      domicilio_piso,
      domicilio_apartamento,
      fecha_nacimiento,
      pregunta1,
      pregunta1_respuesta,
      pregunta2,
      pregunta2_respuesta,
      pregunta3,
      pregunta3_respuesta,
    });
  },

  async update(
    id,
    nombre,
    apellido,
    email,
    domicilio_barrio,
    domicilio_calle,
    domicilio_ciudad,
    domicilio_numero,
    domicilio_piso,
    domicilio_apartamento,
    fecha_nacimiento,
    pregunta1,
    pregunta1_respuesta,
    pregunta2,
    pregunta2_respuesta,
    pregunta3,
    pregunta3_respuesta
  ) {
    return await clientes.update(
      {
        nombre,
        apellido,
        email,
        domicilio_barrio,
        domicilio_calle,
        domicilio_ciudad,
        domicilio_numero,
        domicilio_piso,
        domicilio_apartamento,
        fecha_nacimiento,
        pregunta1,
        pregunta1_respuesta,
        pregunta2,
        pregunta2_respuesta,
        pregunta3,
        pregunta3_respuesta,
      },
      { where: { id: id } }
    );
  },

  async borrarCliente(cliente_id) {
    const cliente = await clientes.findByPk(cliente_id);

    if (!cliente) {
      throw new ClienteNoExisteError();
    }

    const transaction = await db.sequelize.transaction();
    try {
      const cuentas_cliente = await cuentas.findAll({ where: { cliente_id } });
      await Promise.all(
        cuentas_cliente.map((cuenta) => cuenta.destroy({ transaction }))
      );

      const usuario_id = cliente.get("usuario_id");
      const usuario = await usuarios.findByPk(usuario_id);
      if (usuario) {
        await usuario.destroy({ transaction });
      }

      await cliente.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new DesconocidoBDError();
    }
  },

  //Recibe el payload (body del req) y chequea si tiene cuit o dni
  async buscarCliente(tipo, valor) {
    if (tipo === "cuit") return await this.buscarClientePorCuit(valor);
    else if (tipo === "dni") return await this.buscarClientePorDni(valor);
    else if (tipo === "id") return await this.buscarClientePorId(valor);
    throw Error("No se encontro un campo valido");
  },

  buscarClientePorId(client_id) {
    return clientes.findByPk(client_id);
  },

  buscarClientePorDni(dni) {
    return clientes.findOne({ where: { dni: dni } });
  },

  async buscarClientePorCbu(cbu) {
    const cuenta = await cuentas.findOne({ where: { cbu } });
    const cliente = await clientes.findByPk(cuenta.get("cliente_id"));
    return { cuenta, cliente };
  },

  buscarClientePorCuit(cuit) {
    return clientes.findOne({
      where: {
        cuit,
      },
    });
  },

  buscarClientePorUsuario(usuario) {
    const usuario_id = usuario.get("id");
    return clientes.findOne({ where: { usuario_id } });
  },

  asignarUsuario({ cliente, usuario }) {
    const id = cliente.get("id");
    const usuario_id = usuario.get("id");
    return clientes.update({ usuario_id }, { where: { id } });
  },
};
