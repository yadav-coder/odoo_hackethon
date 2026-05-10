const db = require("../config/db");

const mapItem = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    trip: row.trip_id,
    user: row.user_id,
    name: row.name,
    category: row.category,
    quantity: row.quantity,
    packed: row.packed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const create = async (userId, payload) => {
  const result = await db.query(
    `INSERT INTO packing_items (user_id, trip_id, name, category, quantity, packed)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, payload.trip, payload.name, payload.category || "other", payload.quantity || "", Boolean(payload.packed)]
  );

  return mapItem(result.rows[0]);
};

const findByUser = async (userId, tripId) => {
  const values = [userId];
  const where = ["user_id = $1"];

  if (tripId) {
    values.push(tripId);
    where.push(`trip_id = $${values.length}`);
  }

  const result = await db.query(
    `SELECT * FROM packing_items WHERE ${where.join(" AND ")} ORDER BY packed ASC, created_at DESC`,
    values
  );

  return result.rows.map(mapItem);
};

const updateForUser = async (itemId, userId, payload) => {
  const fieldMap = {
    trip: "trip_id",
    name: "name",
    category: "category",
    quantity: "quantity",
    packed: "packed"
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
    const result = await db.query("SELECT * FROM packing_items WHERE id = $1 AND user_id = $2", [itemId, userId]);
    return mapItem(result.rows[0]);
  }

  values.push(itemId, userId);
  const result = await db.query(
    `UPDATE packing_items
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values
  );

  return mapItem(result.rows[0]);
};

const deleteForUser = async (itemId, userId) => {
  const result = await db.query("DELETE FROM packing_items WHERE id = $1 AND user_id = $2 RETURNING *", [
    itemId,
    userId
  ]);
  return mapItem(result.rows[0]);
};

module.exports = {
  create,
  findByUser,
  updateForUser,
  deleteForUser
};
