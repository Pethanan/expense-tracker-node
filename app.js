const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const dotenv = require("dotenv");

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
app.use(express.static(path.join(__dirname, "public")));

const sequelize = require("./util/database");

const expenseRoute = require("./routes/expenses");
const userRoute = require("./routes/user");
const purchaseRoute = require("./routes/purchase");
const PremiumRoutes = require("./routes/premium");

app.use(userRoute);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(PremiumRoutes);

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
