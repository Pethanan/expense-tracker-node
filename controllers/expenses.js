const Expense = require("../models/expense");
const User = require("../models/user");

function isStringInvalid(string) {
  if (!string) {
    return true;
  } else {
    return false;
  }
}

exports.postAddExpense = (req, res) => {
  console.log("reached route point");
  const { amount, description, category } = req.body;
  console.log(req.body);
  if (
    isStringInvalid(amount) ||
    isStringInvalid(description) ||
    isStringInvalid(category)
  ) {
    console.log("stuick");
    return res
      .status(400)
      .json({ success: false, message: "parameter is missing" });
  }

  console.log("passed");
  Expense.create({
    amount,
    description,
    category,
    userId: +req.user.id,
  })
    .then((expense) => {
      User.findByPk(+req.user.id)
        .then((user) =>
          user
            .update({ expensesTotal: user.expensesTotal + amount })
            .then((user) => expense)
            .catch((err) => console.log(err))
        )
        .catch((err) => console.log(err));
    })
    .then((expense) => {
      console.log(expense);
      console.log("reached route point");
      console.log(expense);

      return res.status(201).json({ expense, success: true });
    });
};

exports.getExpenses = async (req, res) => {
  let total_items;

  try {
    total_items = await Expense.count({ where: { userId: req.user.id } });
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json({ expenses, success: true });
  } catch (err) {
    res.status(500).json({ error: err, success: false });
  }
};

exports.deleteExpense = (req, res) => {
  const expenseId = req.params.expenseid;
  console.log("entered route ? ");
  console.log(req.params);
  if (isStringInvalid(expenseId)) {
    return res.status(400).json({ success: false, message: "bad parameter" });
  }
  Expense.destroy({ where: { id: expenseId, userId: req.user.id } })
    .then((noofrows) => {
      if (noofrows === 0) {
        return res.status(400).json({
          success: false,
          message: "user doesnot belong to their expenses",
        });
      }
      return res
        .status(200)
        .json({ success: true, message: "Deleted successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: "failed" });
    });
};
