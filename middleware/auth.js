const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, "secretkeyfortoken");
    console.log("auth");
    console.log(user);
    User.findByPk(user.userId).then((user) => {
      req.user = user;
      console.log("auth");
      console.log("auth");
      console.log(req.user);
      next();
    });
  } catch (err) {
    return res.status(401).json({ success: false });
  }
};

module.exports = auth;
