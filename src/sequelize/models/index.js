const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const makeModelsAssociations = require(__dirname +
  "/../../models/associations");
const createDefaultData = require(__dirname + "/../../models/default_data");
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const modelsPath = __dirname + "/../../models";

fs.readdirSync(modelsPath)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-9) === ".model.js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(modelsPath, file))(sequelize, {
      DataTypes: Sequelize.DataTypes,
      Sequelize,
    });
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

makeModelsAssociations(sequelize);

const syncDb = async (force = false, datos_por_defecto = false) => {
  await sequelize.sync({ force });
  if (datos_por_defecto) {
    await createDefaultData(db);
  }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = { db, syncDb };
