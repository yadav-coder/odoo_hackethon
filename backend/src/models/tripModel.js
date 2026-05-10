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
      payload.title ?? null,
      payload.destination ?? null,
      payload.description || "",
      payload.startDate ?? null,
      payload.endDate ?? null,
      payload.budget || 0,
      payload.coverImage ?? null
    ]
  );
  return mapTrip(result.rows[0]);
};

const findByUser = async (userId, queryString) => {
  const result = await db.query(
    "SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows.map(mapTrip);
};

const findByIdForUser = async (tripId, userId) => {
  const result = await db.query(
    "SELECT * FROM trips WHERE id = $1 AND user_id = $2",
    [tripId, userId]
  );
  return mapTrip(result.rows[0]);
};

const updateForUser = async (tripId, userId, payload) => {
  const result = await db.query(
    `UPDATE trips 
     SET title = COALESCE($1, title), 
         destination = COALESCE($2, destination), 
         description = COALESCE($3, description), 
         start_date = COALESCE($4, start_date), 
         end_date = COALESCE($5, end_date), 
         budget = COALESCE($6, budget), 
         cover_image = COALESCE($7, cover_image), 
         updated_at = NOW() 
     WHERE id = $8 AND user_id = $9 
     RETURNING *`,
    [
      payload.title ?? null,
      payload.destination ?? null,
      payload.description ?? null,
      payload.startDate ?? null,
      payload.endDate ?? null,
      payload.budget ?? null,
      payload.coverImage ?? null,
      tripId,
      userId
    ]
  );
  return mapTrip(result.rows[0]);
};

const deleteForUser = async (tripId, userId) => {
  const result = await db.query(
    "DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING *",
    [tripId, userId]
  );
  return mapTrip(result.rows[0]);
};

module.exports = {
  create,
  findByUser,
  findByIdForUser,
  updateForUser,
  deleteForUser
};