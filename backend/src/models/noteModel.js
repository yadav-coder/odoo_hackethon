const db = require("../config/db");

const mapNote = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    trip: row.trip_id,
    user: row.user_id,
    title: row.title,
    content: row.content,
    noteDate: row.note_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const create = async (userId, payload) => {
  const result = await db.query(
    `INSERT INTO trip_notes (user_id, trip_id, title, content, note_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, payload.trip, payload.title, payload.content || "", payload.noteDate || new Date()]
  );

  return mapNote(result.rows[0]);
};

const findByUser = async (userId, tripId) => {
  const values = [userId];
  const where = ["user_id = $1"];

  if (tripId) {
    values.push(tripId);
    where.push(`trip_id = $${values.length}`);
  }

  const result = await db.query(
    `SELECT * FROM trip_notes WHERE ${where.join(" AND ")} ORDER BY note_date DESC, created_at DESC`,
    values
  );

  return result.rows.map(mapNote);
};

const updateForUser = async (noteId, userId, payload) => {
  const fieldMap = {
    trip: "trip_id",
    title: "title",
    content: "content",
    noteDate: "note_date"
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
    const result = await db.query("SELECT * FROM trip_notes WHERE id = $1 AND user_id = $2", [noteId, userId]);
    return mapNote(result.rows[0]);
  }

  values.push(noteId, userId);
  const result = await db.query(
    `UPDATE trip_notes
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values
  );

  return mapNote(result.rows[0]);
};

const deleteForUser = async (noteId, userId) => {
  const result = await db.query("DELETE FROM trip_notes WHERE id = $1 AND user_id = $2 RETURNING *", [noteId, userId]);
  return mapNote(result.rows[0]);
};

module.exports = {
  create,
  findByUser,
  updateForUser,
  deleteForUser
};
