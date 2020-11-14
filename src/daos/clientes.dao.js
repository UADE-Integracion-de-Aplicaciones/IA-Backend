const Sequelize = require("sequelize");
const { clientes } = require("../sequelize/models").db;

module.exports = {
  //Crea una transaccion / eposito de cuenta
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
        nombre: nombre,
        apellido: apellido,
        email: email,
        domicilio_ciudad: domicilio_ciudad,
        domicilio_calle: domicilio_calle,
        domicilio_barrio: domicilio_barrio,
        domicilio_numero: domicilio_numero,
        domicilio_piso: domicilio_piso,
        domicilio_apartamento: domicilio_apartamento,
        fecha_nacimiento: fecha_nacimiento,
        pregunta1: pregunta1,
        pregunta1_respuesta: pregunta1_respuesta,
        pregunta2: pregunta2,
        pregunta2_respuesta: pregunta2_respuesta,
        pregunta3: pregunta3,
        pregunta3_respuesta: pregunta3_respuesta,
      },
      { where: { id: id } }
    );
  },

  async delete(cliente) {
    return await clientes.destroy();
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
    return clientes.findOne({
      where: {
        dni: dni,
      },
    });
  },

  buscarClientePorCuit(cuit) {
    return clientes.findOne({
      where: {
        cuit: cuit,
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
