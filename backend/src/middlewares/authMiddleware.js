const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Not authorized, token missing" });
      return;
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: "Not authorized, user not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};

