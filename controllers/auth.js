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
        User.create({ name, mail, password })
          .then((user) => {
            res.redirect("/auth/signup");
          })
          .catch((err) => console.log(err));
        return;
      }
      res.render("auth/error", {
        pageTitle: "Error",
        error: "Mail Id already exists",
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/auth/signup");
    });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", { pageTitle: "Login" });
};

exports.postLogin = (req, res, next) => {
  const mail = req.body.mail;
  const password = req.body.password;
  const userLoginCredentials = { mail, password };
  User.findOne({ where: { mail: mail } })
    .then((user) => {
      if (!user) {
        res.render("auth/error", {
          pageTitle: "Authentication error",
          error: "Mail Id does not exist, please signup",
        });
        return;
      } else if (user.password !== password) {
        res.render("auth/error", {
          pageTitle: "Authentication error",
          error: "InCorrect Password",
        });
        return;
      }
      res.render("auth/login", { pageTitle: "Login" });
    })
    .catch((err) => {
      console.log(err);
    });
};
