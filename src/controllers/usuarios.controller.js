const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  registrar,
  buscarUsuarioPorNombreUsuario,
} = require("../daos/usuarios.dao");
const {
  validarCodigoAutorizacion,
  margarCodigoComoUsado,
} = require("../daos/codigoAutorizacion.dao");
const { buscarClientePorDni } = require("../daos/clientes.dao");
const { obtenerRolParaCliente } = require("../daos/roles.dao");
const { Error, ClienteNoExisteError } = require("../daos/errors");

module.exports = {
  async login(req, res) {
    const { body } = req;
    const { nombre_usuario, clave } = body;

    try {
      if (!clave || !nombre_usuario) {
        return res.status(300).json({ mensaje: "faltan datos" });
      }

      const user = await buscarUsuarioPorNombreUsuario(nombre_usuario);

      if (!user) {
        return res.status(301).json({ mensaje: "credenciales incompatibles" });
      }
      const passwordCheck = await bcrypt.compare(clave, user.get("clave"));

      if (!passwordCheck) {
        return res.status(302).json({ mensaje: "credenciales incompatibles" });
      }

      this.generarMensajeExito("Se logeo con exito.", user, res);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ mensaje: "ocurrio algo" });
    }
  },

  async registrar(req, res) {
    const { body } = req;

    const { dni, nombre_usuario, clave, codigo_autorizacion } = body;
    console.log(body);

    try {
      if (!dni || !clave || !nombre_usuario || !codigo_autorizacion) {
        throw new Error("faltan datos");
      }
      const secret = await bcrypt.hash(clave, 8);
      const usuario = await buscarUsuarioPorNombreUsuario(nombre_usuario);

      if (usuario) {
        throw new Error("nombre de usuario no disponible");
      }

      const cliente = await buscarClientePorDni(dni);
      if (!cliente) {
        throw new ClienteNoExisteError();
      }

      const codigo = await validarCodigoAutorizacion({
        cliente,
        codigo: codigo_autorizacion,
      });
      const rol = await obtenerRolParaCliente(cliente);

      const user = await registrar({
        nombre_usuario,
        clave: secret,
        rol_id: rol.get("id"),
      });
      console.log(codigo);

      await margarCodigoComoUsado(codigo);

      res.status(200).json({ mensaje: "usuario creado" });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },

  generarMensajeExito(mensaje, user, res) {
    const token = this.getToken({ userId: user.id });
    const userRespuesta = {
      nombre_usuario: user.nombre_usuario,
      rol: user.role.get("alias"),
      "x-access-token": token,
    };

    res.status(200).json({ message: mensaje, user: userRespuesta });
  },

  getToken(data) {
    return jwt.sign(data, process.env.APP_SECRET || "soy secreto", {
      expiresIn: process.env.JWT_EXPIRATION || "24h",
    });
  },
};
