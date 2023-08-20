const path = require("path");

const express = require("express");

const router = express.Router();

router.post("/user/purchasePremium", userController.getPurchasePremium);

module.exports = router;
