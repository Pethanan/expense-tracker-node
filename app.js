const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/user");
const Expense = require("./models/expense");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

const sequelize = require("./util/database");

const expensesRoute = require("./routes/expenses");
const authRoute = require("./routes/auth");

app.use((req, res, next) => {
  User.findByPk(2)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/auth", authRoute);
app.use(expensesRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
