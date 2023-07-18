const path = require("path");

const express = require("express");

const expensesController = require("../controllers/expenses");

const router = express.Router();

router.get("/add-expense", expensesController.getAddExpense);
router.post("/add-expense", expensesController.postAddExpense);
router.get("/edit-expense/:expenseId", expensesController.getEditExpense);
router.post("/edit-expense", expensesController.postEditExpense);

router.get("/", expensesController.getExpenses);

module.exports = router;
