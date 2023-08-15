const path = require("path");

const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/user");
const expenseController = require("../controllers/expenses");

const router = express.Router();

router.post("/user/signup", userController.postSignup);
router.post("/user/login", userController.postLogin);
router.delete(
  "/expense/deleteexpense/:expenseid",
  auth,
  expenseController.deleteExpense
);

module.exports = router;
