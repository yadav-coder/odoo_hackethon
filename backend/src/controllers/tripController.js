const tripService = require("../services/tripService");
const recommendationService = require("../services/recommendationService");

const createTrip = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.coverImage = `/uploads/trips/${req.file.filename}`;
    }

    const trip = await tripService.createTrip(req.user._id, payload);
    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getTrips(req.user._id, req.query);
    res.status(200).json({ success: true, count: trips.length, trips });
  } catch (error) {
    next(error);
  }
};

const getTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id, req.user._id);

    if (!trip) {
      res.status(404).json({ success: false, message: "Trip not found" });
      return;
    }

    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.coverImage = `/uploads/trips/${req.file.filename}`;
    }

    const trip = await tripService.updateTrip(req.params.id, req.user._id, payload);

    if (!trip) {
      res.status(404).json({ success: false, message: "Trip not found" });
      return;
    }

    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await tripService.deleteTrip(req.params.id, req.user._id);

    if (!trip) {
      res.status(404).json({ success: false, message: "Trip not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Trip deleted" });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await recommendationService.getDestinationRecommendations(req.query);
    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  getRecommendations
};

