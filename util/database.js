const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const db_schema = process.env.DATABASE_SCHEMA;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
console.log(password);
console.log(`${process.env.DATABASE_PASSWORD}`);
const sequelize = new Sequelize(db_schema, user, password, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
