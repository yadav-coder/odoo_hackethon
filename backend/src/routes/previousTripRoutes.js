const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const db = require("../config/db");

const router = express.Router();

// GET /api/previous-trips — returns user's completed trips from the DB
router.get("/", protect, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT * FROM trips WHERE user_id = $1 AND status = 'completed' ORDER BY end_date DESC LIMIT 10`,
      [req.user.id]
    );
    const trips = result.rows.map((row) => ({
      id: row.id,
      destination: row.destination,
      title: row.title,
      startDate: row.start_date,
      endDate: row.end_date,
      budgetSpent: Number(row.total_budget || 0),
      status: row.status,
      coverImage: row.banner_image,
      createdAt: row.created_at,
    }));
    res.status(200).json({ success: true, count: trips.length, data: trips });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
