var env = require("node-env-file");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userDao = require("../daos/user.dao");

module.exports = {
  async login(req, res) {
    const { body } = req;
    const { nombre_usuario, clave } = body;

    try {
      if (!clave || !nombre_usuario) {
        return res.status(300).json({ mensaje: "faltan datos" });
      }

      const user = await userDao.getUserByUserName(nombre_usuario);

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

  async register(req, res) {
    const { body } = req;
    const { nombre_usuario, clave, codigo_autorizacion } = body;
    console.log(body);

    if (!clave || !nombre_usuario || !codigo_autorizacion) {
      return res.status(300).json({ mensaje: "faltan datos" });
    }

    try {
      const secret = await bcrypt.hash(clave, 8);
      const existeUsuario = await userDao.getUserByUserName(nombre_usuario);

      if (existeUsuario) {
        return res
          .status(302)
          .json({ mensaje: "nombre de usuario no disponible" });
      }

      const user = await userDao.registrar({
        nombre_usuario,
        clave: secret,
        rol_id: 3,
      });

      if (!user) {
        return res
          .status(301)
          .json({ mensaje: "hubo un error en la creacion del usuario" });
      }
      console.log("user id", user.id);

      res.status(200).json({ message: "usuario creado con exito" });
    } catch (error) {
      return res.status(500).json({ message: error });
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

  async verificarUsuario(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        res.status(301).send("Parametros inexistentes o incompatibles.");
        return;
      }

      await userDao
        .getUserById(id)
        .then((usuario) => {
          if (usuario) {
            if (usuario.id) {
              res.status(200).send(usuario);
              return usuario;
            }
            res.status(300).send("No se pudo encontrar un usuario.");
            return;
          } else {
            res.status(400).send("Ocurrio un problema al buscar el usuario");
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(401).send("Error al buscar usuario");
        });
    } catch (error) {
      res
        .status(500)
        .send("Ocurrio un problema en el servidor al buscar el usuario por id");
    }
  },
};
