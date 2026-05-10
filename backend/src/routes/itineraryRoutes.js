const express = require("express");
const itineraryController = require("../controllers/itineraryController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(itineraryController.getItineraries)
  .post(itineraryController.createItinerary);

router.route("/:id")
  .put(itineraryController.updateItinerary)
  .delete(itineraryController.deleteItinerary);

module.exports = router;

