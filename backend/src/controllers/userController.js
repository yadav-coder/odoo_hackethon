const User = require("../models/userModel");

const getProfile = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      country: req.body.country
    };

    if (req.file) {
      payload.avatar = `/uploads/profile/${req.file.filename}`;
    }

    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

    const user = await User.updateById(req.user._id, payload);

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};

