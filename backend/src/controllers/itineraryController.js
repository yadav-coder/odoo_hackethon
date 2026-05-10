const Itinerary = require("../models/itineraryModel");

const createItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, itinerary });
  } catch (error) {
    next(error);
  }
};

const getItineraries = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.trip) {
      filter.trip = req.query.trip;
    }

    const itineraries = await Itinerary.find(filter).populate("trip", "title destination").sort("date startTime");
    res.status(200).json({ success: true, count: itineraries.length, itineraries });
  } catch (error) {
    next(error);
  }
};

const updateItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

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
    const itinerary = await Itinerary.findOneAndDelete({ _id: req.params.id, user: req.user._id });

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

