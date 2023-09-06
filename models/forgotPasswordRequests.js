const Sequelize = require("sequelize");

const sequelizeDB = require("../util/database");

const ForgotPasswordRequest = sequelizeDB.define("forgotPasswordRequest", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.STRING,
  },

  isActive: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
  },
});

module.exports = ForgotPasswordRequest;
