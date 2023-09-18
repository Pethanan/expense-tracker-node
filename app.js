const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");

const sequelize = require("./util/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const ForgotPasswordRequest = require("./models/forgotPasswordRequests");
const Order = require("./models/order");
const Upload = require("./models/upload");

const expenseRoute = require("./routes/expenses");
const userRoute = require("./routes/user");
const purchaseRoute = require("./routes/purchase");
const premiumRoute = require("./routes/premium");
const passwordRoute = require("./routes/password");

const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
// Middleware setup
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
app.use(express.static(path.join(__dirname, "public")));

// Routes setup
app.use(userRoute);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(premiumRoute);
app.use(passwordRoute);

// Associations
User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);
ForgotPasswordRequest.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(ForgotPasswordRequest);
User.hasMany(Upload);
Upload.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// Server initialization
sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => {
    console.log(err);
  });
