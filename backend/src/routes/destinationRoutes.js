const express = require("express");
const destinationController = require("../controllers/destinationController");

const router = express.Router();

// Public endpoints for dashboard
router.get("/search", destinationController.searchDestinations);
router.get("/filter", destinationController.filterDestinations);
router.get("/group", destinationController.groupDestinations);
router.get("/", destinationController.getDestinations);

module.exports = router;
