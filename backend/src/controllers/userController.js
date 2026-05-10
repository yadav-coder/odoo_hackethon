const User = require("../models/userModel");

const getProfile = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const allowed = ["firstName", "lastName", "email", "phone", "city", "country"];
    const payload = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        payload[key] = req.body[key];
      }
    }

    if (req.file) {
      payload.avatar = `/uploads/profile/${req.file.filename}`;
    }

    const user = await User.updateProfile(req.user.id, payload);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
