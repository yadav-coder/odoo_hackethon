const db = require("../config/db");

const mapTrip = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    destination: row.destination,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: Number(row.budget),
    coverImage: row.cover_image,
    user: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const create = async (userId, payload) => {
  const result = await db.query(
    `INSERT INTO trips (user_id, title, destination, description, start_date, end_date, budget, cover_image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      userId,
      payload.title,
      payload.destination,
      payload.description || "",
      payload.startDate,
      payload.endDate,
      payload.budget || 0,
      payload.coverImage || ""
    ]
  );

  return mapTrip(result.rows[0]);
};

const findByUser = async (userId, queryString = {}) => {
  const values = [userId];
  const where = ["user_id = $1"];

  if (queryString.keyword) {
    values.push(`%${queryString.keyword}%`);
    where.push(`(title ILIKE $${values.length} OR destination ILIKE $${values.length})`);
  }

  const allowedSorts = new Map([
    ["createdAt", "created_at"],
    ["startDate", "start_date"],
    ["endDate", "end_date"],
    ["budget", "budget"],
    ["title", "title"],
    ["destination", "destination"]
  ]);
  const sortParts = String(queryString.sort || "-createdAt")
    .split(",")
    .map((part) => {
      const direction = part.startsWith("-") ? "DESC" : "ASC";
      const field = part.replace(/^-/, "");
      const column = allowedSorts.get(field);
      return column ? `${column} ${direction}` : null;
    })
    .filter(Boolean);
  const orderBy = sortParts.length > 0 ? sortParts.join(", ") : "created_at DESC";
  const page = Math.max(Number(queryString.page) || 1, 1);
  const limit = Math.min(Math.max(Number(queryString.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;

  values.push(limit, offset);
  const result = await db.query(
    `SELECT *
     FROM trips
     WHERE ${where.join(" AND ")}
     ORDER BY ${orderBy}
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return result.rows.map(mapTrip);
};

const findByIdForUser = async (tripId, userId) => {
  const result = await db.query("SELECT * FROM trips WHERE id = $1 AND user_id = $2", [tripId, userId]);
  return mapTrip(result.rows[0]);
};

const updateForUser = async (tripId, userId, payload) => {
  const fieldMap = {
    title: "title",
    destination: "destination",
    description: "description",
    startDate: "start_date",
    endDate: "end_date",
    budget: "budget",
    coverImage: "cover_image"
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
    return findByIdForUser(tripId, userId);
  }

  values.push(tripId, userId);
  const result = await db.query(
    `UPDATE trips
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values
  );

  return mapTrip(result.rows[0]);
};

const deleteForUser = async (tripId, userId) => {
  const result = await db.query("DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING *", [tripId, userId]);
  return mapTrip(result.rows[0]);
};

module.exports = {
  create,
  findByUser,
  findByIdForUser,
  updateForUser,
  deleteForUser,
  mapTrip
};
