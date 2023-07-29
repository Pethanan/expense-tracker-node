const path = require("path");

const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
