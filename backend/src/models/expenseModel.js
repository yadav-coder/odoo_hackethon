const db = require("../config/db");

const mapExpense = (row) => {
  if (!row) {
    return null;
  }

  const expense = {
    _id: row.id,
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    category: row.category,
    date: row.date,
    note: row.note,
    trip: row.trip_id,
    user: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (row.trip_title || row.trip_destination) {
    expense.trip = {
      _id: row.trip_id,
      id: row.trip_id,
      title: row.trip_title,
      destination: row.trip_destination
    };
  }

  return expense;
};

const create = async (userId, payload) => {
  const result = await db.query(
    `INSERT INTO expenses (user_id, trip_id, title, amount, category, date, note)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      userId,
      payload.trip,
      payload.title,
      payload.amount,
      payload.category || "other",
      payload.date || new Date(),
      payload.note || ""
    ]
  );

  return mapExpense(result.rows[0]);
};

const findByUser = async (userId, tripId) => {
  const values = [userId];
  const where = ["expenses.user_id = $1"];

  if (tripId) {
    values.push(tripId);
    where.push(`expenses.trip_id = $${values.length}`);
  }

  const result = await db.query(
    `SELECT expenses.*, trips.title AS trip_title, trips.destination AS trip_destination
     FROM expenses
     LEFT JOIN trips ON trips.id = expenses.trip_id
     WHERE ${where.join(" AND ")}
     ORDER BY expenses.date DESC`,
    values
  );

  return result.rows.map(mapExpense);
};

const updateForUser = async (expenseId, userId, payload) => {
  const fieldMap = {
    title: "title",
    amount: "amount",
    category: "category",
    date: "date",
    note: "note",
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
    const result = await db.query("SELECT * FROM expenses WHERE id = $1 AND user_id = $2", [expenseId, userId]);
    return mapExpense(result.rows[0]);
  }

  values.push(expenseId, userId);
  const result = await db.query(
    `UPDATE expenses
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values
  );

  return mapExpense(result.rows[0]);
};

const deleteForUser = async (expenseId, userId) => {
  const result = await db.query("DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *", [expenseId, userId]);
  return mapExpense(result.rows[0]);
};

module.exports = {
  create,
  findByUser,
  updateForUser,
  deleteForUser
};
