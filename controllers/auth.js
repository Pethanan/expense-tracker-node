const Expense = require("../models/expense");

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", { pageTitle: "Signup" });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const mail = req.body.mail;
  const password = req.body.password;
  const user = { name, mail, password };
  console.log(user);
  res.redirect("/auth/signup");
};
