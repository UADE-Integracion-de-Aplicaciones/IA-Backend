const dao = require("../daos/cuentas.dao");
const { Error, ClienteNoExisteError } = require("../daos/errors");
const {
  buscarClientePorId,
  obtenerCantidadDeCuentasPorCliente,
} = require("../daos/clientes.dao");
const { generarCodigoAutorizacion } = require("../daos/codigoAutorizacion.dao");

module.exports = {
  async crear(req, res) {
    const { body } = req;
    const { tipo, cliente_id } = body;

    try {
      if (!tipo || !cliente_id) {
        throw new Error("faltan datos");
      }

      let fondo_descubierto;
      if (body.hasOwnProperty("fondo_descubierto")) {
        fondo_descubierto = body.fondo_descubierto;
      } else {
        fondo_descubierto = 0;
      }

      const cliente = await buscarClientePorId(cliente_id);
      if (!cliente) {
        throw new ClienteNoExisteError();
      }

      const { usuario_id } = res.locals.decoded;

      await dao.crear({
        tipo,
        cliente_id,
        fondo_descubierto,
        usuario_id,
      });

      let respuestaAdicional;
      const cantidadCuentas = await obtenerCantidadDeCuentasPorCliente(cliente);
      if (cantidadCuentas == 1) {
        const codigo = await generarCodigoAutorizacion(cliente);
        const codigo_autorizacion = codigo.get("codigo");
        respuestaAdicional = { codigo_autorizacion };
      }

      return res
        .status(200)
        .json({ mensaje: "cuenta creada", ...respuestaAdicional });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },

  async delete(req, res) {
    await dao
      .delete(req.body)
      .then(() =>
        res.status(200).send({ message: "Se elimino la cuenta correctamente" })
      )
      .catch((error) => res.status(400).send(error));
  },

  async getCuenta(req, res) {
    try {
      await dao
        .getcuentas(req.body)
        .then((cuenta) => res.status(200).send(cuenta))
        .catch((error) => res.status(400).send(error));
    } catch (error) {
      res.status(500).send({ message: "Error al buscar la cuneta" });
    }
  },

  async getSaldo(req, res) {
    try {
      await dao
        .getSaldo(req.body)
        .then((saldo) => {
          if (saldo)
            res
              .status(200)
              .send(saldo)
              .end();

          res.status(300).send("No se pudo encontrar una cuenta o el saldo");
        })
        .catch((error) =>
          res
            .status(400)
            .send("No se pudo encontrar la cuenta u obtener el saldo")
        );
    } catch (error) {
      res.status(500).send({ message: "Error al buscar la cuneta" });
    }
  },

  async getResumenCuenta(req, res) {
    try {
      await dao
        .getcuentasByNumerocuentas(req.body.numero_cuenta)
        .then((resumen) => res.status(200).send(resumen))
        .catch((error) => {
          console.log(error);
          res.status(400).send(error);
        });
    } catch (error) {
      res.status(500).send({ message: "Error al buscar la cuneta" });
    }
  },
};
