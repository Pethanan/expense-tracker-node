const path = require("path");
const express = require("express");

const passwordController = require("../controllers/password");

const router = express.Router();

router.post("/password/forgotPassword", passwordController.postForgotPassword);
router.get(
  "/password/resetPassword/:requestId",
  passwordController.getResetPassword
);
router.post(
  "/password/updatePassword/:requestId",
  passwordController.postUpdatePassword
);
module.exports = router;
