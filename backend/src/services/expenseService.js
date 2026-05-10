const Expense = require("../models/expenseModel");

const createExpense = (userId, payload) => Expense.create({ ...payload, user: userId });

const getExpenses = (userId, tripId) => {
  const filter = { user: userId };

  if (tripId) {
    filter.trip = tripId;
  }

  return Expense.find(filter).populate("trip", "title destination").sort("-date");
};

const updateExpense = (expenseId, userId, payload) => {
  return Expense.findOneAndUpdate({ _id: expenseId, user: userId }, payload, {
    new: true,
    runValidators: true
  });
};

const deleteExpense = (expenseId, userId) => Expense.findOneAndDelete({ _id: expenseId, user: userId });

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};

