  const { db, syncDb } = require("../../src/sequelize/models");
  const { roles, usuarios } = db;
  const { crearData } = require("../fixtures");
  
  beforeEach(async () => {
    await syncDb(true);
    await crearData();
  });

  const {
    getUserByUserName,
    registrar
  } = require("../../src/daos/user.dao");

  it("(función) Obtener usuario.", async () => {
    const nombre_usuario = "alejandro.otero";
    let usuario = await getUserByUserName(nombre_usuario);
  
    expect(usuario.get("nombre_usuario")).toBe(nombre_usuario);
    expect(usuario.get("clave")).toBe("123");
  });

  it("(función) Registrar usuario.", async () => {
    const rol1 = await roles.create({
        descripcion: "rol de prueba",
        alias: "ROLPRUEBA",
    });

    const nombre_usuario = "usuario123";
    const clave = "clave123"
    const rol_id = rol1.get('id')
    await registrar(nombre_usuario, clave, rol_id);
  
    const usuario = usuarios.findOne({ where: {nombre_usuario: nombre_usuario} }) 
    expect(usuario.get("nombre_usuario")).toBe(nombre_usuario);
    expect(usuario.get("clave")).toBe(clave);
    expect(usuario.get("id")).toBe(rol_id);
  });