const PackingItem = require("../models/packingModel");

const createItem = async (req, res, next) => {
  try {
    const item = await PackingItem.create(req.user._id, req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

const getItems = async (req, res, next) => {
  try {
    const items = await PackingItem.findByUser(req.user._id, req.query.trip);
    const packed = items.filter((item) => item.packed).length;
    res.status(200).json({ success: true, count: items.length, packed, items });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await PackingItem.updateForUser(req.params.id, req.user._id, req.body);

    if (!item) {
      res.status(404).json({ success: false, message: "Packing item not found" });
      return;
    }

    res.status(200).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await PackingItem.deleteForUser(req.params.id, req.user._id);

    if (!item) {
      res.status(404).json({ success: false, message: "Packing item not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Packing item deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem
};
