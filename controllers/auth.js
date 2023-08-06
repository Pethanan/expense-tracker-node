const bcrypt = require("bcrypt");

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
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          User.create({ name, mail, password: hash })
            .then((user) => {
              res
                .status(201)
                .json({ message: "User profile Successfully created" });
            })
            .catch((err) => console.log(err));
        });

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
  User.findOne({ where: { mail: mail } })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.render("auth/error", {
          pageTitle: "Authentication error",
          error: "Mail Id does not exist, please signup",
        });
        return;
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (!err) {
          res.redirect("/add-expense");
        } else {
          console.log(err);
        }
      });
      // else if (user.password !== password) {
      //   res.render("auth/error", {
      //     pageTitle: "Authentication error",
      //     error: "InCorrect Password",
      //   });
      //   return;
      // }
      // req.userMail = mail;
      // res.redirect("/add-expense");
    })
    .catch((err) => {
      console.log(err);
    });
};
