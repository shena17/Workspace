const express = require("express");
const router = express.Router();

const salaryController = require("../controllers/SalaryController");

router.post(
  "/create-and-update-payment-status",
  salaryController.createSalaryAndUpdatePaymentStatus
);

router.get("/", salaryController.getSalariesByDateRange);

router.get("/total-amount-and-bonus", salaryController.getTotalAmountAndBonus);

module.exports = router;
