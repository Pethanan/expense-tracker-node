const Expense = require("../models/expense");
const User = require("../models/user");
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", { pageTitle: "Signup" });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const mail = req.body.mail;
  const password = req.body.password;
  const user = { name, mail, password };
  console.log(user);
  User.findOne({ where: { mail: mail } })
    .then((user) => {
      if (!user) {
        return User.create({ name, mail, password });
      }
      console.log("Usermail id aleady exists");
      return user;
    })
    .then((user) => {
      res.redirect("/auth/error");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/auth/signup");
    });
};

exports.getError = (req, res, next) => {
  res.render("auth/error", {
    pageTitle: "Error",
    error: "Duplicate Mail Id",
  });
};
