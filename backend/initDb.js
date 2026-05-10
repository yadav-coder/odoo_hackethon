const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const { pool } = require("./src/config/db");

const initDb = async () => {
  try {
    console.log("Initializing database schema from outside database folder...");
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql");
    const seedPath = path.join(__dirname, "..", "database", "seed.sql");
    
    await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    console.log("Cleared existing database schema.");

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8");
      await pool.query(schema);
      console.log("Database schema initialized successfully!");
    } else {
      console.warn("Schema file not found at " + schemaPath);
    }

    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, "utf8");
      await pool.query(seed);
      console.log("Database seeded successfully!");
    } else {
      console.warn("Seed file not found at " + seedPath);
    }

    const migrationPath = path.join(__dirname, "..", "database", "migrations", "012_align_existing_tables_with_backend.sql");
    if (fs.existsSync(migrationPath)) {
      const migration = fs.readFileSync(migrationPath, "utf8");
      await pool.query(migration);
      console.log("Backend alignment migration executed successfully!");
    } else {
      console.warn("Migration file not found at " + migrationPath);
    }
  } catch (error) {
    console.error(`Error initializing database: ${error.message}`);
    process.exitCode = 1;
  } finally {
    pool.end();
  }
};

initDb();
