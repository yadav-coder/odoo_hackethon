const expenseService = require("../services/expenseService");

const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user._id, req.body);
    res.status(201).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.getExpenses(req.user._id, req.query.trip);
    res.status(200).json({ success: true, count: expenses.length, expenses });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.user._id, req.body);

    if (!expense) {
      res.status(404).json({ success: false, message: "Expense not found" });
      return;
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.deleteExpense(req.params.id, req.user._id);

    if (!expense) {
      res.status(404).json({ success: false, message: "Expense not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};

