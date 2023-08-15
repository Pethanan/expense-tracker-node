const path = require("path");

const express = require("express");
const auth = require("../middleware/auth");
const expenseController = require("../controllers/expenses");

const router = express.Router();

router.post("/addExpense", expenseController.postExpense);
router.get("/getExpenses", auth, expenseController.getExpenses);
router.delete(
  "/deleteexpense/:expenseid",
  auth,
  expenseController.deleteExpense
);

module.exports = router;
