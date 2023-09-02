const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isStringInvalid(string) {
  if (!string) {
    return true;
  } else {
    return false;
  }
}

exports.postSignup = async (req, res, next) => {
  try {
    console.log("entered here, server is working");
    const { name, email, password } = req.body;
    console.log(name);
    console.log(email);
    console.log(password);

    if (
      isStringInvalid(name) ||
      isStringInvalid(email) ||
      isStringInvalid(password)
    ) {
      return res
        .status(400)
        .json({ err: "bad parameter....something went wrong" });
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      if (err) {
        throw new Error("something went wrong");
      }
      await User.create({ name, email, password: hash, premiumUser: false });
      res.status(201).json({ message: "succesfully created new user" });
    });
  } catch {
    (err) => {
      return res.status(500).json(err);
    };
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("email" + email);

    if (isStringInvalid(email) || isStringInvalid(password)) {
      console.log("did no pass init test");

      res
        .status(400)
        .json({ message: "email or password is missing", success: false });
    }
    const user = await User.findAll({ where: { email } });
    if (user.length > 0) {
      console.log("passed init test");
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          throw new Error("something went wrong");
        }
        if (result === true) {
          res.status(200).json({
            success: true,
            message: "user logged in successfully",
            token: generateAccessToken(
              user[0].id,
              user[0].name,
              user[0].premiumUser
            ),
          });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "password is incorrect" });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "user doesnot exist" });
    }
  } catch {
    (err) => {
      res.status(500).json({ message: err, success: false });
    };
  }
};

function generateAccessToken(userId, name, premiumUser) {
  return jwt.sign({ userId, name, premiumUser }, "secretkeyfortoken");
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
