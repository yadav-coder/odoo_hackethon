const { Pool } = require("pg");
const logger = require("../utils/logger");

const getDbConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL
    };
  }

  return {
    host: process.env.PGHOST || "127.0.0.1",
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE || "traveeaseloop",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres"
  };
};

const formatDbError = (error) => {
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.map((item) => item.message || item.code || String(item)).join("; ");
  }

  return error.message || error.code || String(error);
};

const pool = new Pool(
  getDbConfig()
);

pool.on("error", (error) => {
  logger.error(`Unexpected PostgreSQL error: ${formatDbError(error)}`);
});

const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    logger.info("PostgreSQL connected");
  } catch (error) {
    throw new Error(formatDbError(error));
  }
};

module.exports = {
  connectDB,
  query: (text, params) => pool.query(text, params),
  pool
};

