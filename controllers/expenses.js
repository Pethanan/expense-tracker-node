const Expense = require("../models/expense");

exports.getAddExpense = (req, res, next) => {
  res.render("add-expense", { pageTitle: "Add Expense" });
};

exports.postAddExpense = (req, res, next) => {
  const title = req.body.title;
  const amount = +req.body.amount;
  const description = req.body.description;

  Expense.create({
    title,
    amount,
    description,
  })
    .then((result) => {
      res.redirect("/");
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditExpense = (req, res, next) => {
  const expenseId = req.params.expenseId;
  Expense.findByPk(expenseId)
    .then((expense) => {
      if (!expense) {
        return res.redirect("/");
      }
      res.render("edit-expense", {
        pageTitle: "Edit Expense",
        expense: expense,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditExpense = (req, res, next) => {
  const expenseId = req.body.expenseId;
  const updatedTitle = req.body.title;
  const updatedAmount = req.body.amount;
  const updatedDesc = req.body.description;
  Expense.findByPk(expenseId)
    .then((expense) => {
      expense.title = updatedTitle;
      expense.amount = updatedAmount;
      expense.description = updatedDesc;
      return expense.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!", result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteExpense = (req, res, next) => {
  const expenseId = req.body.expenseId;
  Expense.findByPk(expenseId)
    .then((expense) => {
      return expense.destroy();
    })
    .then((result) => {
      console.log("Item DELETED");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getExpenses = (req, res, next) => {
  Expense.findAll()
    .then((expenses) => {
      res.render("expenses", {
        expenses: expenses,
        pageTitle: "expenses",
        path: "expenses",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};