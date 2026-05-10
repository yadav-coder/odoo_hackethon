const db = require("../config/db");

const mapTrip = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    destination: row.destination,
    description: row.short_overview || row.description || "",
    shortOverview: row.short_overview,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: Number(row.total_budget || row.budget || 0),
    status: row.status || "upcoming",
    coverImage: row.banner_image || row.cover_image,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const create = async (userId, payload) => {
  const result = await db.query(
    `INSERT INTO trips (user_id, title, destination, short_overview, start_date, end_date, total_budget, banner_image, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      userId,
      payload.title || payload.destination || "Untitled Trip",
      payload.destination || null,
      payload.description || payload.shortOverview || "",
      payload.startDate || null,
      payload.endDate || null,
      payload.budget || payload.totalBudget || 0,
      payload.coverImage || payload.bannerImage || null,
      payload.status || "upcoming",
    ]
  );
  return mapTrip(result.rows[0]);
};

const findByUser = async (userId, queryParams = {}) => {
  let query = "SELECT * FROM trips WHERE user_id = $1";
  const values = [userId];
  let idx = 2;

  if (queryParams.status) {
    query += ` AND status = $${idx++}`;
    values.push(queryParams.status);
  }

  query += " ORDER BY created_at DESC";

  if (queryParams.limit) {
    query += ` LIMIT $${idx++}`;
    values.push(Number(queryParams.limit));
  }

  const result = await db.query(query, values);
  return result.rows.map(mapTrip);
};

const findById = async (tripId) => {
  const result = await db.query("SELECT * FROM trips WHERE id = $1", [tripId]);
  return mapTrip(result.rows[0]);
};

const findByIdForUser = async (tripId, userId) => {
  const result = await db.query("SELECT * FROM trips WHERE id = $1 AND user_id = $2", [tripId, userId]);
  return mapTrip(result.rows[0]);
};

const updateForUser = async (tripId, userId, payload) => {
  const result = await db.query(
    `UPDATE trips 
     SET title = COALESCE($1, title), 
         destination = COALESCE($2, destination), 
         short_overview = COALESCE($3, short_overview), 
         start_date = COALESCE($4, start_date), 
         end_date = COALESCE($5, end_date), 
         total_budget = COALESCE($6, total_budget), 
         banner_image = COALESCE($7, banner_image), 
         status = COALESCE($8, status),
         updated_at = NOW() 
     WHERE id = $9 AND user_id = $10 
     RETURNING *`,
    [
      payload.title ?? null,
      payload.destination ?? null,
      payload.description ?? payload.shortOverview ?? null,
      payload.startDate ?? null,
      payload.endDate ?? null,
      payload.budget ?? payload.totalBudget ?? null,
      payload.coverImage ?? payload.bannerImage ?? null,
      payload.status ?? null,
      tripId,
      userId,
    ]
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
  findById,
  findByIdForUser,
  updateForUser,
  deleteForUser,
};