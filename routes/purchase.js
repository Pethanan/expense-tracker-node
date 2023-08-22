const path = require("path");
const purchaseController = require("../controllers/purcahse");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get(
  "/purchase/premium-membership",
  authMiddleware,
  purchaseController.getPurchasePremium
);

router.post(
  "/purchase/update-transaction-status",
  authMiddleware,
  purchaseController.postUpdateTransactionStatus
);

module.exports = router;
