const db = require("../config/db");

const mapInvoice = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    invoiceNumber: row.invoice_number,
    trip: row.trip_id,
    user: row.user_id,
    status: row.status,
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    discount: Number(row.discount),
    total: Number(row.total),
    tripTitle: row.trip_title,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const mapItem = (row) => ({
  _id: row.id,
  id: row.id,
  invoice: row.invoice_id,
  description: row.description,
  category: row.category,
  quantity: Number(row.quantity),
  unitCost: Number(row.unit_cost),
  amount: Number(row.amount)
});

const create = async (userId, payload) => {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.amount || item.quantity * item.unitCost || 0), 0);
  const tax = Number(payload.tax || 0);
  const discount = Number(payload.discount || 0);
  const total = Number(payload.total || subtotal + tax - discount);
  const invoiceNumber = payload.invoiceNumber || `INV-${Date.now()}`;

  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");
    const invoiceResult = await client.query(
      `INSERT INTO invoices (invoice_number, user_id, trip_id, status, subtotal, tax, discount, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [invoiceNumber, userId, payload.trip, payload.status || "pending", subtotal, tax, discount, total]
    );

    const invoice = mapInvoice(invoiceResult.rows[0]);

    for (const item of items) {
      const quantity = Number(item.quantity || 1);
      const unitCost = Number(item.unitCost || 0);
      const amount = Number(item.amount || quantity * unitCost);
      await client.query(
        `INSERT INTO invoice_items (invoice_id, description, category, quantity, unit_cost, amount)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [invoice.id, item.description, item.category || "travel", quantity, unitCost, amount]
      );
    }

    await client.query("COMMIT");
    return invoice;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findByUser = async (userId, tripId) => {
  const values = [userId];
  const where = ["invoices.user_id = $1"];

  if (tripId) {
    values.push(tripId);
    where.push(`invoices.trip_id = $${values.length}`);
  }

  const result = await db.query(
    `SELECT invoices.*, trips.title AS trip_title
     FROM invoices
     LEFT JOIN trips ON trips.id = invoices.trip_id
     WHERE ${where.join(" AND ")}
     ORDER BY invoices.created_at DESC`,
    values
  );

  return result.rows.map(mapInvoice);
};

const findByIdForUser = async (invoiceId, userId) => {
  const invoiceResult = await db.query("SELECT * FROM invoices WHERE id = $1 AND user_id = $2", [invoiceId, userId]);
  const invoice = mapInvoice(invoiceResult.rows[0]);

  if (!invoice) {
    return null;
  }

  const itemsResult = await db.query("SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id ASC", [invoiceId]);
  invoice.items = itemsResult.rows.map(mapItem);
  return invoice;
};

const markPaidForUser = async (invoiceId, userId) => {
  const result = await db.query(
    `UPDATE invoices
     SET status = 'paid', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [invoiceId, userId]
  );

  return mapInvoice(result.rows[0]);
};

module.exports = {
  create,
  findByUser,
  findByIdForUser,
  markPaidForUser
};
