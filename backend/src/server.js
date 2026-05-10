const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { connectDB } = require("./config/db");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`PostgreSQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

