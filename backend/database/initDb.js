const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const { pool } = require("../src/config/db");

const initDb = async () => {
  try {
    console.log("Initializing database schema...");
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    
    await pool.query(schema);
    console.log("Database schema initialized successfully!");
  } catch (error) {
    console.error(`Error initializing database: ${error.message}`);
    process.exitCode = 1;
  } finally {
    pool.end();
  }
};

initDb();
