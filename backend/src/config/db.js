const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    logger.warn("MONGO_URI is not set. Database connection skipped.");
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

