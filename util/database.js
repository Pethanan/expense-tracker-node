const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "peth-expense-tracker-schema",
  "root",
  "PETHmysql1@",
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
