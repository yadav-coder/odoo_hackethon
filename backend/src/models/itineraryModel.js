const db = require("../config/db");

const mapItinerary = (row) => {
  if (!row) {
    return null;
  }

  const itinerary = {
    _id: row.id,
    id: row.id,
    title: row.title,
    location: row.location,
    notes: row.notes,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    trip: row.trip_id,
    user: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (row.trip_title || row.trip_destination) {
    itinerary.trip = {
      _id: row.trip_id,
      id: row.trip_id,
      title: row.trip_title,
      destination: row.trip_destination
    };
  }

  return itinerary;
};

const create = async (userId, payload) => {
  const result = await db.query(
    `INSERT INTO itineraries (user_id, trip_id, title, location, notes, date, start_time, end_time)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      userId,
      payload.trip ?? null,
      payload.title ?? null,
      payload.location || "",
      payload.notes || "",
      payload.date ?? null,
      payload.startTime || null,
      payload.endTime || null
    ]
  );

  return mapItinerary(result.rows[0]);
};

const findByUser = async (userId, tripId) => {
  const values = [userId];
  const where = ["itineraries.user_id = $1"];

  if (tripId) {
    values.push(tripId);
    where.push(`itineraries.trip_id = $${values.length}`);
  }

  const result = await db.query(
    `SELECT itineraries.*, trips.title AS trip_title, trips.destination AS trip_destination
     FROM itineraries
     LEFT JOIN trips ON trips.id = itineraries.trip_id
     WHERE ${where.join(" AND ")}
     ORDER BY itineraries.date ASC, itineraries.start_time ASC`,
    values
  );

  return result.rows.map(mapItinerary);
};

const updateForUser = async (itineraryId, userId, payload) => {
  const fieldMap = {
    title: "title",
    location: "location",
    notes: "notes",
    date: "date",
    startTime: "start_time",
    endTime: "end_time",
    trip: "trip_id"
  };
  const fields = [];
  const values = [];

  Object.entries(fieldMap).forEach(([key, column]) => {
    if (payload[key] !== undefined) {
      values.push(payload[key]);
      fields.push(`${column} = $${values.length}`);
    }
  });

  if (fields.length === 0) {
    const result = await db.query("SELECT * FROM itineraries WHERE id = $1 AND user_id = $2", [itineraryId, userId]);
    return mapItinerary(result.rows[0]);
  }

  values.push(itineraryId, userId);
  const result = await db.query(
    `UPDATE itineraries
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values
  );

  return mapItinerary(result.rows[0]);
};

const deleteForUser = async (itineraryId, userId) => {
  const result = await db.query("DELETE FROM itineraries WHERE id = $1 AND user_id = $2 RETURNING *", [
    itineraryId,
    userId
  ]);
  return mapItinerary(result.rows[0]);
};

module.exports = {
  create,
  findByUser,
  updateForUser,
  deleteForUser
};
