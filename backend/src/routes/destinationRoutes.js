const express = require("express");
const destinationController = require("../controllers/destinationController");

const router = express.Router();

// Public endpoint for dashboard search
router.get("/", destinationController.getDestinations);

module.exports = router;

