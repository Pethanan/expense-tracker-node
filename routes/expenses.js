const path = require("path");

const express = require("express");

const expensesController = require("../controllers/expenses");

const router = express.Router();

router.get("/expenses", expensesController.getExpenses);
router.post("/add-expense", expensesController.postAddExpense);
router.get("/edit-expense/:expenseId", expensesController.getEditExpense);
router.post("/edit-expense", expensesController.postEditExpense);
router.post("/delete-expense", expensesController.postDeleteExpense);

router.get("/", expensesController.getAddExpense);

module.exports = router;
