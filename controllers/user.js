const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SequelizeDB = require("../util/database");
const AWS = require("aws-sdk");

function isStringInvalid(string) {
  if (!string) {
    return true;
  } else {
    return false;
  }
}

exports.postSignup = async (req, res, next) => {
  try {
    const t = await SequelizeDB.transaction();

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
      await User.create(
        { name, email, password: hash, premiumUser: false },
        { transaction: t }
      );
      await t.commit();
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

exports.getDownload = async (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(400).json({ message: "only for premium user" });
  }
  try {
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURl = await uploadToS3(stringifiedExpenses, filename);
    console.log(fileURl);
    //await req.user.createFilelink({fileURl:fileURl})

    res.status(200).json({ fileURl, success: true });
  } catch (err) {
    res.status(500).json({ fileURl: "", success: false, err: err });
  }
};

function uploadToS3(data, filename) {
  const S3_BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });
  var params = {
    Bucket: S3_BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("something went wrong", err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
}
