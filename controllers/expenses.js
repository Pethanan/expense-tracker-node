const Expense = require("../models/expense");

function isstringinvalid(string) {
  if (!string) {
    return true;
  } else {
    return false;
  }
}

exports.postExpense = async (req, res) => {
  try {
    const { expenseAmount, expenseDescription, expenseCategory } = req.body;
    if (
      isstringinvalid(expenseAmount) ||
      isstringinvalid(expenseDescription) ||
      isstringinvalid(expenseCategory)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "parameter is missing" });
    }
    await Expense.create({
      expenseAmount,
      expenseDescription,
      expenseCategory,
      userId: req.user.id,
    }).then((expense) => {
      return res.status(201).json({ expense, success: true });
    });
  } catch {
    (err) => {
      return res.status(500).json({ success: false, error: err });
    };
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
  const expenseId = req.params.expenseId;
  if (isstringinvalid(expenseId)) {
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
