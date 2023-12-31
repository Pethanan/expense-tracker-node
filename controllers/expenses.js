const Expense = require("../models/expense");
const Upload = require("../models/upload");
const User = require("../models/user");
const SequelizeDB = require("../util/database");
const AWS = require("aws-sdk");

function isStringInvalid(string) {
  if (!string) {
    return true;
  } else {
    return false;
  }
}

exports.postAddExpense = async (req, res) => {
  const t = await SequelizeDB.transaction();

  try {
    console.log("reached route point");
    const { amount, description, category } = req.body;
    console.log(req.body);
    if (
      isStringInvalid(amount) ||
      isStringInvalid(description) ||
      isStringInvalid(category)
    ) {
      console.log("stuck");
      return res
        .status(400)
        .json({ success: false, message: "parameter is missing" });
    }

    console.log("passed");
    console.log(req.user);

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        userId: +req.user.id,
      },
      { transaction: t }
    );
    const user = await User.findByPk(+req.user.id);
    await user.update(
      { expensesTotal: user.expensesTotal + amount },
      { transaction: t }
    );
    await t.commit();
    return res.status(201).json({ expense, success: true });
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
exports.getExpenses = async (req, res) => {
  let total_items;

  const page = +req.query.page || 1;

  // Using the limit query parameter or defaulting to 3 if not provided
  const limit = +req.query.limit || 5;

  try {
    total_items = await Expense.count({ where: { userId: req.user.id } });

    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * limit,
      limit: limit, // use the provided limit here
    });

    const pagination = {
      currentPage: page,
      hasNextPage: limit * page < total_items,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(total_items / limit),
    };

    res.status(200).json({ expenses, pagination, success: true });
  } catch (err) {
    res.status(500).json({ error: err, success: false });
  }
};

exports.deleteExpense = async (req, res) => {
  const t = await SequelizeDB.transaction();

  try {
    console.log("delete middleware");
    const expenseId = req.params.expenseId;
    console.log("entered route ? ");
    console.log(req.params);
    console.log(expenseId);

    if (isStringInvalid(expenseId)) {
      return res.status(400).json({ success: false, message: "bad parameter" });
    }
    console.log(expenseId);

    const noofrows = await Expense.destroy({
      where: { id: +expenseId, userId: +req.user.id },
      transaction: t,
    });
    await t.commit();
    console.log(noofrows);

    console.log(noofrows);

    if (noofrows === 0) {
      return res.status(400).json({
        success: false,
        message: "user doesnot belong to their expenses",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: "failed" });
  }
};

exports.getDownload = async (req, res, next) => {
  console.log("req.user.isPremium", req.user.premiumUser);
  if (!req.user.premiumUser) {
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
    console.log(fileURl);
    console.log(fileURl);
    //await req.user.createFilelink({fileURl:fileURl})
    Upload.create({ fileURl, userId });
    res.status(200).json({ fileURl, success: true });
  } catch (err) {
    res.status(500).json({ fileURl: "", success: false, err: err });
  }
};

function uploadToS3(data, filename) {
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  const IAM_USER_ACCESS_KEY_ID = process.env.IAM_USER_ACCESS_KEY_ID;
  const IAM_USER_SECRET_ACCESS_KEY = process.env.IAM_USER_SECRET_ACCESS_KEY;

  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_ACCESS_KEY_ID,
    secretAccessKey: IAM_USER_SECRET_ACCESS_KEY,
  });
  var params = {
    Bucket: S3_BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  console.log("params", params);

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
