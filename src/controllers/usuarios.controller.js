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
const {
  buscarClientePorDni,
  buscarClientePorUsuario,
  asignarUsuario,
} = require("../daos/clientes.dao");
const { buscarEmpleadoPorUsuario } = require("../daos/empleados.dao");
const { obtenerRolParaCliente } = require("../daos/roles.dao");
const { Error, ClienteNoExisteError } = require("../daos/errors");

const obtenerAccessToken = (data) => {
  return jwt.sign(data, process.env.APP_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

module.exports = {
  async login(req, res) {
    const { body } = req;
    const { nombre_usuario, clave } = body;

    try {
      if (!clave || !nombre_usuario) {
        throw new Error("faltan datos");
      }

      const user = await buscarUsuarioPorNombreUsuario(nombre_usuario);

      if (!user) {
        throw new Error("credenciales incompatibles");
      }
      const passwordCheck = await bcrypt.compare(clave, user.get("clave"));

      if (!passwordCheck) {
        throw new Error("credenciales incompatibles");
      }

      const accessToken = obtenerAccessToken({ usuario_id: user.id });

      let datosPersonal;
      if (user.role.get("alias").startsWith("BANCO_")) {
        datosPersonal = await buscarEmpleadoPorUsuario(user);
      } else {
        datosPersonal = await buscarClientePorUsuario(user);
      }

      const respuesta = {
        nombre_usuario: user.get("nombre_usuario"),
        cliente: {
          nombre: datosPersonal.get("nombre"),
          apellido: datosPersonal.get("apellido"),
        },
        rol: user.role.get("alias"),
        "x-access-token": accessToken,
      };

      res.status(200).json({ message: "se logeo con exito", user: respuesta });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },

  async registrar(req, res) {
    const { body } = req;

    const { dni, nombre_usuario, clave, codigo_autorizacion } = body;

    try {
      if (!dni || !clave || !nombre_usuario || !codigo_autorizacion) {
        throw new Error("faltan datos");
      }
      const secret = await bcrypt.hash(clave, 8);
      const existeUsuario = await buscarUsuarioPorNombreUsuario(nombre_usuario);

      if (existeUsuario) {
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

      const usuario = await registrar({
        nombre_usuario,
        clave: secret,
        rol_id: rol.get("id"),
      });
      console.log(codigo);

      await asignarUsuario({ cliente, usuario });
      await margarCodigoComoUsado(codigo);

      res.status(200).json({ mensaje: "usuario creado" });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },
};
