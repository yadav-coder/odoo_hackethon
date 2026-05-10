const express = require("express");
const expenseController = require("../controllers/expenseController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const { expenseValidation } = require("../validations/expenseValidation");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(expenseController.getExpenses)
  .post(validate(expenseValidation), expenseController.createExpense);

router.route("/:id")
  .put(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;

