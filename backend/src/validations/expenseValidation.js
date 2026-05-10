const expenseValidation = {
  title: { required: true },
  amount: { required: true, isNumber: true },
  trip: { required: true }
};

module.exports = {
  expenseValidation
};

