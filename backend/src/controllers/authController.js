const authService = require("../services/authService");

const sendAuthResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    success: true,
    token: data.token,
    user: {
      id: data.user._id,
      name: data.user.name,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      email: data.user.email,
      phone: data.user.phone,
      city: data.user.city,
      country: data.user.country,
      role: data.user.role,
      avatar: data.user.avatar
    }
  });
};

const register = async (req, res, next) => {
  try {
    const data = await authService.registerUser(req.body);
    sendAuthResponse(res, 201, data);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.loginUser(req.body);
    sendAuthResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

module.exports = {
  register,
  login,
  me
};

