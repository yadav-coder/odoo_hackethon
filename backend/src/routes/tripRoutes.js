const express = require("express");
const tripController = require("../controllers/tripController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadTripImage } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// All trip routes require authentication
router.use(protect);

router.route("/")
  .get(tripController.getTrips)
  .post(uploadTripImage, tripController.createTrip);

router.get("/recommendations", tripController.getRecommendations);

router.route("/:id")
  .get(tripController.getTrip)
  .put(uploadTripImage, tripController.updateTrip)
  .delete(tripController.deleteTrip);

module.exports = router;
