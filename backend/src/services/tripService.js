const Trip = require("../models/tripModel");
const ApiFeatures = require("../utils/apiFeatures");

const createTrip = (userId, payload) => Trip.create({ ...payload, user: userId });

const getTrips = async (userId, queryString) => {
  const features = new ApiFeatures(Trip.find({ user: userId }), queryString)
    .search(["title", "destination"])
    .sort()
    .paginate();

  return features.query;
};

const getTripById = (tripId, userId) => Trip.findOne({ _id: tripId, user: userId });

const updateTrip = (tripId, userId, payload) => {
  return Trip.findOneAndUpdate({ _id: tripId, user: userId }, payload, {
    new: true,
    runValidators: true
  });
};

const deleteTrip = (tripId, userId) => Trip.findOneAndDelete({ _id: tripId, user: userId });

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
};

