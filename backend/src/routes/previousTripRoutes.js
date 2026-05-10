const express = require("express");
const previousTripController = require("../controllers/previousTripController");

const router = express.Router();

// Public endpoint for dashboard mock data
router.get("/", previousTripController.getPreviousTrips);

module.exports = router;

