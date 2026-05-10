const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password });

  return {
    user,
    token: generateToken(user._id)
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    user,
    token: generateToken(user._id)
  };
};

module.exports = {
  registerUser,
  loginUser
};

