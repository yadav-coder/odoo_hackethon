const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const { registerValidation, loginValidation } = require("../validations/authValidation");

const router = express.Router();

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);
router.get("/me", protect, authController.me);

module.exports = router;

