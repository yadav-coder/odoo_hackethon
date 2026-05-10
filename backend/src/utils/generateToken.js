const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
};

module.exports = generateToken;

