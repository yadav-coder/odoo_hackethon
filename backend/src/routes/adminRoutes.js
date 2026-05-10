const express = require("express");
const adminController = require("../controllers/adminController");
const { authorize, protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", adminController.getDashboard);
router.get("/users", adminController.getUsers);

module.exports = router;
