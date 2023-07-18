const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("peth_node", "root", "PETHmysql1@", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
