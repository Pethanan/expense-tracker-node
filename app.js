const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const User = require("./models/user");
const Expense = require("./models/expense");
const ForgotPasswordRequest = require("./models/forgotPasswordRequests");
const Order = require("./models/order");
const dotenv = require("dotenv");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
app.use(express.static(path.join(__dirname, "public")));

const sequelize = require("./util/database");

const expenseRoute = require("./routes/expenses");
const userRoute = require("./routes/user");
const purchaseRoute = require("./routes/purchase");
const premiumRoute = require("./routes/premium");
const passwordRoute = require("./routes/password");

app.use(userRoute);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(premiumRoute);
app.use(passwordRoute);

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);
ForgotPasswordRequest.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(ForgotPasswordRequest);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
