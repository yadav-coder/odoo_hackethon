const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const registerUser = async ({ name, firstName, lastName, email, password, phone, city, country }) => {
  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const displayName = name || [firstName, lastName].filter(Boolean).join(" ").trim();

  if (!displayName) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name: displayName,
    firstName,
    lastName,
    email,
    password,
    phone,
    city,
    country
  });

  return {
    user,
    token: generateToken(user._id)
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findByEmail(email, true);

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

