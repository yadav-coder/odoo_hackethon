const tripValidation = {
  title: { required: true },
  destination: { required: true },
  startDate: { required: true },
  endDate: { required: true },
  budget: { isNumber: true }
};

module.exports = {
  tripValidation
};

