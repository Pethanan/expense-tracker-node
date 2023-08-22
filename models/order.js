const Sequelize = require("sequelize");

const sequelizeDB = require("../util/database");
const sequelize = require("../util/database");

const Order = sequelizeDB.define("order", {
  id: {
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  paymentId: Sequelize.STRING,
  orderId: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Order;
