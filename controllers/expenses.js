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
      Expense.update(
        {
          title: updatedTitle,
          amount: updatedAmount,
          description: updatedDesc,
        },
        { where: { id: expense.id } }
      );
      return expense;
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
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

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Expense.destroy(prodId)
    .then((expense) => {
      return product.destroy();
    })
    .then((expense) => {
      console.log("detroyed");
      res.redirect("/expenses");
    })
    .catch((err) => {
      console.log(err);
    });
};
