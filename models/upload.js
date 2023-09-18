const Sequelize = require("sequelize");

const sequelizeDB = require("../util/database");
const sequelize = require("../util/database");

const Upload = sequelizeDB.define("order", {
  id: {
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  fileURl: { type: Sequelize.STRING, allowNull: false },
});

module.exports = Upload;
