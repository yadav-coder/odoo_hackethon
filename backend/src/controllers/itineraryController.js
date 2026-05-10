const Itinerary = require("../models/itineraryModel");

const createItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.create(req.user._id, req.body);
    res.status(201).json({ success: true, itinerary });
  } catch (error) {
    next(error);
  }
};

const getItineraries = async (req, res, next) => {
  try {
    const itineraries = await Itinerary.findByUser(req.user._id, req.query.trip);
    res.status(200).json({ success: true, count: itineraries.length, itineraries });
  } catch (error) {
    next(error);
  }
};

const updateItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.updateForUser(req.params.id, req.user._id, req.body);

    if (!itinerary) {
      res.status(404).json({ success: false, message: "Itinerary not found" });
      return;
    }

    res.status(200).json({ success: true, itinerary });
  } catch (error) {
    next(error);
  }
};

const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.deleteForUser(req.params.id, req.user._id);

    if (!itinerary) {
      res.status(404).json({ success: false, message: "Itinerary not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Itinerary deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItinerary,
  getItineraries,
  updateItinerary,
  deleteItinerary
};

