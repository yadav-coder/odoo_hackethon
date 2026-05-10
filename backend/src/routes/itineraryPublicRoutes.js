const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const db = require("../config/db");
const router = express.Router();

// GET /api/itinerary/:tripId - get itinerary sections for a trip
router.get("/:tripId", protect, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const result = await db.query(
      `SELECT ts.*, json_agg(
          json_build_object(
            'id', i.id,
            'title', i.title,
            'activity', i.activity,
            'location', i.location,
            'scheduledDate', i.scheduled_date,
            'startTime', i.start_time,
            'endTime', i.end_time,
            'notes', i.notes,
            'estimatedCost', i.estimated_cost
          ) ORDER BY i.start_time
        ) FILTER (WHERE i.id IS NOT NULL) AS items
      FROM trip_sections ts
      LEFT JOIN itineraries i ON i.section_id = ts.id
      WHERE ts.trip_id = $1
      GROUP BY ts.id
      ORDER BY ts.sort_order, ts.start_date`,
      [tripId]
    );
    res.status(200).json({ success: true, sections: result.rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/itinerary/generate - generate a basic itinerary structure
router.post("/generate", protect, async (req, res) => {
  const { destination, startDate, endDate } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

  const sections = Array.from({ length: Math.min(days, 7) }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      id: `day-${i + 1}`,
      title: `Day ${i + 1} — ${destination}`,
      city: destination,
      scheduledDate: d.toISOString().split("T")[0],
      sortOrder: i + 1,
      items: [],
    };
  });

  res.status(200).json({ success: true, sections });
});

// POST /api/itinerary/save - save itinerary sections and items
router.post("/save", protect, async (req, res, next) => {
  const { tripId, sections } = req.body;
  if (!tripId || !sections) {
    return res.status(400).json({ success: false, message: "tripId and sections are required" });
  }

  try {
    // Clear existing sections for this trip
    await db.query("DELETE FROM itineraries WHERE trip_id = $1", [tripId]);
    await db.query("DELETE FROM trip_sections WHERE trip_id = $1", [tripId]);

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const secResult = await db.query(
        `INSERT INTO trip_sections (trip_id, title, city, description, sort_order, start_date)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [tripId, sec.title, sec.city || null, sec.description || null, i + 1, sec.scheduledDate || null]
      );
      const sectionId = secResult.rows[0].id;

      if (sec.items && sec.items.length > 0) {
        for (const item of sec.items) {
          await db.query(
            `INSERT INTO itineraries (trip_id, section_id, title, activity, location, scheduled_date, start_time, end_time, notes, estimated_cost)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              tripId, sectionId,
              item.title || "Activity",
              item.activity || null,
              item.location || null,
              item.scheduledDate || sec.scheduledDate || null,
              item.startTime || null,
              item.endTime || null,
              item.notes || null,
              item.estimatedCost || 0,
            ]
          );
        }
      }
    }

    res.status(200).json({ success: true, message: "Itinerary saved successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
