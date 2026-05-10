const express = require("express");
const invoiceController = require("../controllers/invoiceController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(invoiceController.getInvoices)
  .post(invoiceController.createInvoice);

router.get("/:id", invoiceController.getInvoice);
router.patch("/:id/paid", invoiceController.markPaid);

module.exports = router;
