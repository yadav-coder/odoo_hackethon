const User = require("../models/userModel");

const getProfile = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      email: req.body.email
    };

    if (req.file) {
      payload.avatar = `/uploads/profile/${req.file.filename}`;
    }

    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

    const user = await User.findByIdAndUpdate(req.user._id, payload, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};

