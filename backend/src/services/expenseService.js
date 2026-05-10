const Expense = require("../models/expenseModel");

const createExpense = (userId, payload) => Expense.create(userId, payload);

const getExpenses = (userId, tripId) => Expense.findByUser(userId, tripId);

const updateExpense = (expenseId, userId, payload) => Expense.updateForUser(expenseId, userId, payload);

const deleteExpense = (expenseId, userId) => Expense.deleteForUser(expenseId, userId);

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};

