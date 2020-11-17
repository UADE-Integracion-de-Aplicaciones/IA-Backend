const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  registrar,
  buscarUsuarioPorNombreUsuario,
  cambiarPassword
} = require("../daos/usuarios.dao");
const {
  validarCodigoAutorizacion,
  marcarCodigoComoUsado,
} = require("../daos/codigoAutorizacion.dao");
const {
  buscarClientePorDni,
  buscarClientePorUsuario,
  asignarUsuario,
} = require("../daos/clientes.dao");
const { buscarEmpleadoPorUsuario } = require("../daos/empleados.dao");
const { obtenerRolParaCliente } = require("../daos/roles.dao");
const { generarCodigoAutorizacion } = require("../daos/codigoAutorizacion.dao");
const { Error, ClienteNoExisteError } = require("../daos/errors");
const { SMTP_CONFIG, SERVICE_DETAILS } = require("../daos/common");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const transporter = nodemailer.createTransport(SMTP_CONFIG);

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: SERVICE_DETAILS.name,
    link: SERVICE_DETAILS.url,
  },
});

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

      let entidad;
      if (user.role.get("alias").startsWith("BANCO_")) {
        entidad = await buscarEmpleadoPorUsuario(user);
      } else {
        entidad = await buscarClientePorUsuario(user);
      }

      const respuesta = {
        nombre_usuario: user.get("nombre_usuario"),
        entidad: {
          id: entidad.get("id"),
          nombre: entidad.get("nombre"),
          apellido: entidad.get("apellido"),
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
      await marcarCodigoComoUsado(codigo);

      res.status(200).json({ mensaje: "usuario creado" });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },

  async olvide_mi_clave(req, res) {
    const { body } = req;
    const { dni } = body;

    try {
      if (!dni) {
        throw new Error("faltan datos");
      }
      const cliente = await buscarClientePorDni(dni);
      if (!cliente) {
        throw new ClienteNoExisteError();
      }

      const codigo = await generarCodigoAutorizacion(cliente);
      let nombre_completo = cliente.get("nombre");
      if (nombre_completo) {
        nombre_completo += " " + cliente.get("apellido");
      }
      const email = cliente.get("email");

      const response = {
        body: {
          name: nombre_completo,
          intro: `Debido a que entraste a la opción de 'Olvidé mi Contraseña',
            hemos generado un código de autorización para que puedes restablecer tu contraseña.
            Tu código de autorización es: <b>${codigo.get("codigo")}</b>`,
          greeting: "Hola",
          signature: "Atentamente",
        },
      };

      const mail = MailGenerator.generate(response);

      const mensaje = {
        from: SERVICE_DETAILS.email,
        to: email,
        subject: "Olvidé mi contraseña",
        html: mail,
      };

      await transporter.sendMail(mensaje);

      res.status(200).json({
        mensaje: "código de autorización enviado a tu buzón de correo",
      });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },

  async recuperar_clave(req, res) {
    const { body } = req;
    const { dni, nombre_usuario, clave, codigo_autorizacion } = body;

    try {
      if (!dni || !nombre_usuario || !clave || !codigo_autorizacion) {
        throw new Error("faltan datos");
      }

      const cliente = await buscarClientePorDni(dni);
      if (!cliente) {
        throw new ClienteNoExisteError();
      }

      const user = await buscarUsuarioPorNombreUsuario(nombre_usuario);
      if (!user) {
        //throw new ClienteNoExisteError();
      }

      const codigo = await validarCodigoAutorizacion({
        cliente,
        codigo: codigo_autorizacion,
      });

      await cambiarPassword(user.get("id"), clave);
      await marcarCodigoComoUsado(codigo);
      res.status(200).json({
        mensaje: "Contrasena cambiada con exito.",
      });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },
};
