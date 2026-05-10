const db = require("../config/db");

const getDashboard = async (req, res, next) => {
  try {
    const [users, trips, popularCities, popularActivities] = await Promise.all([
      db.query("SELECT COUNT(*)::int AS total FROM users"),
      db.query("SELECT COUNT(*)::int AS total, COALESCE(SUM(budget), 0)::numeric AS total_budget FROM trips"),
      db.query(
        `SELECT destination AS city, COUNT(*)::int AS trips
         FROM trips
         GROUP BY destination
         ORDER BY trips DESC
         LIMIT 5`
      ),
      db.query(
        `SELECT category, COUNT(*)::int AS count
         FROM expenses
         GROUP BY category
         ORDER BY count DESC
         LIMIT 5`
      )
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        users: users.rows[0].total,
        trips: trips.rows[0].total,
        totalBudget: Number(trips.rows[0].total_budget),
        popularCities: popularCities.rows,
        popularActivities: popularActivities.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, name, first_name, last_name, email, phone, city, country, avatar, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.status(200).json({ success: true, count: result.rows.length, users: result.rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers
};
