const moment = require("moment");
const dao = require("../daos/clientes.dao");
const { obtenerCuentas } = require("../daos/cuentas.dao");
const { Error, ClienteNoExisteError } = require("../daos/errors");

const generarRespuestaCliente = ({ cliente, cuentas }) => {
  const respuestaCuentas = cuentas.map((cuenta) => ({
    tipo: cuenta.get("tipo"),
    numero_cuenta: cuenta.get("numero_cuenta"),
    cbu: cuenta.get("cbu"),
    saldo: cuenta.get("saldo"),
  }));

  return {
    id: cliente.get("id"),
    tipo: cliente.get("tipo"),
    cuit: cliente.get("cuit"),
    dni: cliente.get("dni"),
    nombre: cliente.get("nombre"),
    apellido: cliente.get("apellido"),
    email: cliente.get("email"),
    domicilio_barrio: cliente.get("domicilio_barrio"),
    domicilio_calle: cliente.get("domicilio_calle"),
    domicilio_ciudad: cliente.get("domicilio_ciudad"),
    domicilio_numero: cliente.get("domicilio_numero"),
    domicilio_piso: cliente.get("domicilio_piso"),
    domicilio_apartamento: cliente.get("domicilio_apartamento"),
    fecha_nacimiento: cliente.get("fecha_nacimiento"),
    pregunta1: cliente.get("pregunta1"),
    pregunta2: cliente.get("pregunta2"),
    pregunta3: cliente.get("pregunta3"),
    cuentas: respuestaCuentas,
  };
};

module.exports = {
  async create(req, res) {
    const { body } = req;
    const {
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
    } = body;

    try {
      if (
        !tipo ||
        !cuit ||
        !dni ||
        !nombre ||
        !apellido ||
        !email ||
        !domicilio_barrio ||
        !domicilio_calle ||
        !domicilio_ciudad ||
        !domicilio_numero ||
        !domicilio_piso ||
        !domicilio_apartamento ||
        !pregunta1 ||
        !pregunta1_respuesta ||
        !pregunta2 ||
        !pregunta2_respuesta ||
        !pregunta3 ||
        !pregunta3_respuesta
      ) {
        throw new Error("faltan datos");
      }

      let fechaNacimiento;
      if (fecha_nacimiento) {
        fechaNacimiento = moment(fecha_nacimiento).format("YYYY-MM-DD");
      }

      const cliente = await dao.crear({
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
        fecha_nacimiento: fechaNacimiento,
        pregunta1,
        pregunta1_respuesta,
        pregunta2,
        pregunta2_respuesta,
        pregunta3,
        pregunta3_respuesta,
      });

      return res.status(200).json({ mensaje: "cliente creado" });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },

  async verificarCliente(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        res.status(301).send("Parametros inexistentes o incompatibles.");
        return;
      }

      await dao
        .getClienteById(id)
        .then((cliente) => {
          if (cliente) {
            if (cliente.id) {
              res.status(200).send(cliente);
              return cliente;
            }
            res.status(300).send("No se pudo encontrar un cliente.");
            return;
          } else {
            res.status(400).send("Ocurrio un problema al buscar el cliente");
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(401).send("Error al buscar cliente");
        });
    } catch (error) {
      res
        .status(500)
        .send("Ocurrio un problema en el servidor al buscar el cliente por id");
    }
  },

  modify(req, res) {
    try {
      const {
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
        pregunta3_respuesta,
      } = req.body;
      var fechaNacimiento = moment(fecha_nacimiento).format("YYYY-MM-DD");

      dao
        .update(
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
          fechaNacimiento,
          pregunta1,
          pregunta1_respuesta,
          pregunta2,
          pregunta2_respuesta,
          pregunta3,
          pregunta3_respuesta
        )
        .then((cliente) => {
          if (!cliente) {
            res
              .status(301)
              .send("Ocurrio un error en la modificacion del cliente");
            return;
          }

          res.status(200).send(cliente);
          return cliente;
        })
        .catch((error) => {
          console.log(error);
          res.status(400).send("Error en la modificacion del clinete");
        });
    } catch (error) {
      res.status(500).send("Error al intentar modificar un cliente");
    }
  },

  async borrar(req, res) {
    const { params } = req;
    const { cliente_id } = params;

    try {
      await dao.borrarCliente(cliente_id);

      return res.status(200).json({ mensaje: "cliente eliminado" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },

  async buscarClientePorDni(req, res) {
    const { query } = req;
    const { numero } = query;

    try {
      if (!numero) {
        throw new Error("faltan datos");
      }

      const cliente = await dao.buscarClientePorDni(numero);
      if (!cliente) {
        throw new ClienteNoExisteError();
      }
      const cuentas = await obtenerCuentas(cliente);

      const respuesta = generarRespuestaCliente({ cliente, cuentas });

      return res.status(200).json({ cliente: respuesta });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },

  async buscarClientePorCbu(req, res) {
    const { query } = req;
    const { numero } = query;

    try {
      if (!numero) {
        throw new Error("faltan datos");
      }
      console.log(numero);
      const { cliente, cuenta } = await dao.buscarClientePorCbu(numero);
      if (!cliente) {
        throw new ClienteNoExisteError();
      }

      const respuesta = generarRespuestaCliente({ cliente, cuentas: [cuenta] });

      return res.status(200).json({ cliente: respuesta });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },

  async buscarClientePorCuit(req, res) {
    const { query } = req;
    const { numero } = query;

    try {
      if (!numero) {
        throw new Error("faltan datos");
      }

      const cliente = await dao.buscarClientePorCuit(numero);
      if (!cliente) {
        throw new ClienteNoExisteError();
      }
      const cuentas = await obtenerCuentas(cliente);

      const respuesta = generarRespuestaCliente({ cliente, cuentas });

      return res.status(200).json({ cliente: respuesta });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },
};
