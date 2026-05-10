const Note = require("../models/noteModel");

const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.user._id, req.body);
    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.findByUser(req.user._id, req.query.trip);
    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await Note.updateForUser(req.params.id, req.user._id, req.body);

    if (!note) {
      res.status(404).json({ success: false, message: "Trip note not found" });
      return;
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.deleteForUser(req.params.id, req.user._id);

    if (!note) {
      res.status(404).json({ success: false, message: "Trip note not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Trip note deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote
};
