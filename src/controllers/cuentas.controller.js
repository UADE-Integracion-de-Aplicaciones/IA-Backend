const dao = require("../daos/cuentas.dao");
const { Error, ClienteNoExisteError } = require("../daos/errors");
const {
  buscarClientePorId,
  obtenerCantidadDeCuentasPorCliente,
  buscarClientePorUsuario,
} = require("../daos/clientes.dao");
const { buscarUsuarioPorId } = require("../daos/usuarios.dao");
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

      const cuenta = await dao.crear({
        tipo,
        cliente_id,
        fondo_descubierto,
        usuario_id,
      });

      let respuestaAdicional = {
        cuenta: {
          cbu: cuenta.get("cbu"),
          numero_cuenta: cuenta.get("numero_cuenta"),
        },
      };

      const cantidadCuentas = await obtenerCantidadDeCuentasPorCliente(cliente);
      if (cantidadCuentas == 1) {
        const codigo = await generarCodigoAutorizacion(cliente);
        const codigo_autorizacion = codigo.get("codigo");
        respuestaAdicional = { ...respuestaAdicional, codigo_autorizacion };
      }

      return res
        .status(200)
        .json({ mensaje: "cuenta creada", ...respuestaAdicional });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },

  async obtenerCuentas(req, res) {
    const { query } = req;

    let cliente;
    if (query.hasOwnProperty("cliente_id")) {
      cliente_id = query.cliente_id;
      cliente = await buscarClientePorId(cliente_id);
    } else {
      const { usuario_id } = res.locals.decoded;
      const usuario = await buscarUsuarioPorId(usuario_id);
      cliente = await buscarClientePorUsuario(usuario);
    }

    try {
      if (!cliente) {
        throw new ClienteNoExisteError();
      }

      const cuentas = await dao.obtenerCuentas(cliente);

      const respuesta = cuentas.map((cuenta) => ({
        numero_cuenta: cuenta.get("numero_cuenta"),
        cbu: cuenta.get("cbu"),
      }));

      return res.status(200).json({ cuentas: respuesta });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },

  // numero de cuenta, cbu
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
