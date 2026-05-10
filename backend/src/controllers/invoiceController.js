const Invoice = require("../models/invoiceModel");

const createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.user.id, req.body);
    res.status(201).json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.findByUser(req.user.id, req.query.trip);
    res.status(200).json({ success: true, count: invoices.length, invoices });
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdForUser(req.params.id, req.user.id);

    if (!invoice) {
      res.status(404).json({ success: false, message: "Invoice not found" });
      return;
    }

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

const markPaid = async (req, res, next) => {
  try {
    const invoice = await Invoice.markPaidForUser(req.params.id, req.user.id);

    if (!invoice) {
      res.status(404).json({ success: false, message: "Invoice not found" });
      return;
    }

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  markPaid
};
