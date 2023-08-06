const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Expense = sequelize.define("expense", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  description: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Expense;
