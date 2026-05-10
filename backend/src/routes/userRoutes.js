const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadProfile } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, uploadProfile, userController.updateProfile);

module.exports = router;

