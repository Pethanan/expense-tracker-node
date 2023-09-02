const path = require("path");

const express = require("express");
const auth = require("../middleware/auth");
const expenseController = require("../controllers/expenses");

const router = express.Router();

router.post("/expense/addExpense", auth, expenseController.postAddExpense);
router.get("/expense/getExpenses", auth, expenseController.getExpenses);
router.delete(
  "/expense/deleteExpense/:expenseId",
  auth,
  expenseController.deleteExpense
);

module.exports = router;
