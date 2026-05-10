const express = require("express");
const tripController = require("../controllers/tripController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadTripImage } = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validationMiddleware");
const { tripValidation } = require("../validations/tripValidation");

const router = express.Router();

// Public create endpoint for the frontend "Plan New Trip" page (no auth required)
router.post("/create", tripController.createTripPublic);
// Public list/search/filter/group/sort endpoints for UserTrips screen (no auth required)
router.get("/search", tripController.getTripsPublic);
router.get("/filter", tripController.getTripsPublic);
router.get("/group", tripController.getTripsPublic);
router.get("/sort", tripController.getTripsPublic);
router.get("/", tripController.getTripsPublic);

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

