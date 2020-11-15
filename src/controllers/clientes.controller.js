const moment = require("moment");
const dao = require("../daos/clientes.dao");
const { generarCodigoAutorizacion } = require("../daos/codigoAutorizacion.dao");
const { Error } = require("../daos/errors");

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

      const codigo = await generarCodigoAutorizacion(cliente);
      const codigo_autorizacion = codigo.get("codigo");

      return res
        .status(200)
        .json({ mensaje: "cliente creado", codigo_autorizacion });
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

  async delete(req, res) {
    const { id } = req.body;

    if (!id) {
      res.status(301).send("Parametros inexistentes o incompatibles.");
      return;
    }

    const cliente = await dao.buscarClientePorId(id);

    if (cliente) {
      if (cliente.id) {
        dao.delete(cliente);
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

      await dao
        .buscarClientePorDni(dni)
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

  async buscarClientePorCbu(req, res) {
    try {
      const { cbu } = req.body;

      if (!cbu) {
        res.status(301).send("Parametros inexistentes o incompatibles.");
        return;
      }

      await dao
        .buscarClientePorCbu(cbu)
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

      await dao
        .buscarClientePorId(id)
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
