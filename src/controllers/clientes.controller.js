const moment = require("moment");
const clientsDao = require("../daos/clientes.dao");

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
      usuario_id,
    } = body;

    try {
      const fechaNacimiento = moment(fecha_nacimiento).format("YYYY-MM-DD");

      await clientsDao.crear({
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
      return res.status(404).json({ mensaje: error.name });
    }
  },

  async verificarCliente(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        res.status(301).send("Parametros inexistentes o incompatibles.");
        return;
      }

      await clientsDao
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

      clientsDao
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

  async delete(req, res) {
    const { id } = req.query;

    if (!id) {
      res.status(301).send("Parametros inexistentes o incompatibles.");
      return;
    }

    const cliente = await clientsDao.buscarCliente("id", id);

    if (cliente) {
      if (cliente.id) {
        clientsDao.delete(cliente);
        res.status(200).send("El cliente se ha eliminado con exito");
      } else res.status(300).send("No se pudo encontrar un cliente.");
      return;
    } else {
      res.status(400).send("El cliente no existe");
    }
  },

  async buscarClientePorDni(req, res) {
    try {
      const { dni } = req.body;

      if (!dni) {
        res.status(301).send("Parametros inexistentes o incompatibles.");
        return;
      }

      await clientsDao
        .getClienteByDni(dni)
        .then((cliente) => {
          if (cliente) {
            if (cliente.id) res.status(200).send(cliente);
            else res.status(300).send("No se pudo encontrar un cliente.");

            return;
          } else {
            res.status(400).send("Ocurrio un problema al buscar el cliente");
          }
        })
        .catch((error) => res.status(401).send("Error al buscar cliente"));
    } catch (error) {
      res
        .status(500)
        .send(
          "Ocurrio un problema en el servidor al buscar el cliente por dni"
        );
    }
  },

  async buscarClientePorId(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        res.status(301).send("Parametros inexistentes o incompatibles.");
        return;
      }

      await clientsDao
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
        .catch((error) => res.status(401).send("Error al buscar cliente"));
    } catch (error) {
      res
        .status(500)
        .send("Ocurrio un problema en el servidor al buscar el cliente por id");
    }
  },
};
