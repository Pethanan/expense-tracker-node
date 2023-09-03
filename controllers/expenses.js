const Expense = require("../models/expense");
const User = require("../models/user");
const SequelizeDB = require("../util/database");

function isStringInvalid(string) {
  if (!string) {
    return true;
  } else {
    return false;
  }
}

exports.postAddExpense = async (req, res) => {
  try {
    const t = await SequelizeDB.transaction();
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

exports.deleteExpense = async (req, res) => {
  const t = await SequelizeDB.transaction();

  const expenseId = req.params.expenseid;
  console.log("entered route ? ");
  console.log(req.params);
  if (isStringInvalid(expenseId)) {
    return res.status(400).json({ success: false, message: "bad parameter" });
  }
  Expense.destroy({
    where: { id: expenseId, userId: req.user.id, transaction: t },
  })
    .then(async (noofrows) => {
      if (noofrows === 0) {
        return res.status(400).json({
          success: false,
          message: "user doesnot belong to their expenses",
        });
      }
      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: "Deleted successfully" });
    })
    .catch(async (err) => {
      await t.rollback();
      return res.status(500).json({ success: false, message: "failed" });
    });
};
