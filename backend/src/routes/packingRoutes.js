const express = require("express");
const packingController = require("../controllers/packingController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(packingController.getItems)
  .post(packingController.createItem);

router.route("/:id")
  .put(packingController.updateItem)
  .delete(packingController.deleteItem);

module.exports = router;
