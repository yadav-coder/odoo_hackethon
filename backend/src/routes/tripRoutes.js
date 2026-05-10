const express = require("express");
const tripController = require("../controllers/tripController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadTripImage } = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validationMiddleware");
const { tripValidation } = require("../validations/tripValidation");

const router = express.Router();

router.use(protect);

router.get("/recommendations", tripController.getRecommendations);
router.route("/")
  .get(tripController.getTrips)
  .post(uploadTripImage, validate(tripValidation), tripController.createTrip);

router.route("/:id")
  .get(tripController.getTrip)
  .put(uploadTripImage, tripController.updateTrip)
  .delete(tripController.deleteTrip);

module.exports = router;

