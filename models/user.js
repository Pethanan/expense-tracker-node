const Sequelize = require("sequelize");

const sequelizeDB = require("../util/database");

const User = sequelizeDB.define("user", {
  id: {
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  premiumUser: { type: Sequelize.BOOLEAN, allowNull: false },
  expensesTotal: { type: Sequelize.INTEGER },
});

module.exports = User;
