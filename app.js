const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const User = require("./models/user");
const Expense = require("./models/expense");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const sequelize = require("./util/database");

const expenseRoute = require("./routes/expenses");
const userRoute = require("./routes/user");

app.use(userRoute);
app.use(expenseRoute);

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
