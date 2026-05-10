const Trip = require("../models/tripModel");

const createTrip = (userId, payload) => Trip.create(userId, payload);

const getTrips = (userId, queryString) => Trip.findByUser(userId, queryString);

const getTripById = (tripId, userId) => Trip.findByIdForUser(tripId, userId);

const updateTrip = (tripId, userId, payload) => Trip.updateForUser(tripId, userId, payload);

const deleteTrip = (tripId, userId) => Trip.deleteForUser(tripId, userId);

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
};

