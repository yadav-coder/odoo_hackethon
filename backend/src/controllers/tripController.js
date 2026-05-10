const tripService = require("../services/tripService");
const recommendationService = require("../services/recommendationService");
const tripPublicService = require("../services/tripPublicService");

const createTripPublic = async (req, res) => {
  const destination = String(req.body?.destination || "").trim();
  const startDate = String(req.body?.startDate || "").trim();
  const startDateTime = String(req.body?.startDateTime || "").trim();
  const endDate = String(req.body?.endDate || "").trim();
  const endDateTime = String(req.body?.endDateTime || "").trim();

  if (!destination || !startDate || !startDateTime || !endDate) {
    return res.status(400).json({
      success: false,
      message: "destination, startDate, startDateTime, endDate are required"
    });
  }

  const trip = tripPublicService.createTrip({
    destination,
    startDate,
    endDate,
    title: req.body?.title,
    travelers: req.body?.travelers,
    budget: req.body?.budget,
    type: req.body?.type,
    summary: req.body?.summary
  });

  return res.status(201).json({
    success: true,
    message: "Trip Created Successfully",
    trip: {
      ...trip,
      startDateTime,
      endDateTime: endDateTime || undefined
    }
  });
};

const getTripsPublic = async (req, res) => {
  const q = req.query.q;
  const groupBy = req.query.groupBy;
  const sortBy = req.query.sortBy;
  const sortDir = req.query.sortDir;
  const status = req.query.status;
  const minBudget = req.query.minBudget;
  const maxBudget = req.query.maxBudget;
  const travelersMin = req.query.travelersMin;
  const travelersMax = req.query.travelersMax;
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;
  const page = req.query.page;
  const limit = req.query.limit;

  const result = tripPublicService.listTrips({
    q,
    groupBy,
    sortBy,
    sortDir,
    status,
    minBudget,
    maxBudget,
    travelersMin,
    travelersMax,
    startFrom,
    endTo,
    page,
    limit
  });

  return res.status(200).json({
    success: true,
    meta: result.meta,
    data: result.data
  });
};

const createTrip = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.coverImage = `/uploads/trips/${req.file.filename}`;
    }

    const trip = await tripService.createTrip(req.user.id, payload);
    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getTrips(req.user.id, req.query);
    res.status(200).json({ success: true, count: trips.length, trips });
  } catch (error) {
    next(error);
  }
};

const getTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id, req.user.id);

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

    const trip = await tripService.updateTrip(req.params.id, req.user.id, payload);

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
    const trip = await tripService.deleteTrip(req.params.id, req.user.id);

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
  createTripPublic,
  getTripsPublic,
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  getRecommendations
};
