const bcrypt = require("bcryptjs");
const db = require("../config/db");

const mapUser = (row, includePassword = false) => {
  if (!row) {
    return null;
  }

  const user = {
    _id: row.id,
    id: row.id,
    name: row.name,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    country: row.country,
    avatar: row.avatar,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (includePassword) {
    user.password = row.password;
    user.matchPassword = (password) => bcrypt.compare(password, row.password);
  }

  return user;
};

const findByEmail = async (email, includePassword = false) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return mapUser(result.rows[0], includePassword);
};

const create = async ({ name, firstName, lastName, email, password, phone, city, country }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO users (name, first_name, last_name, email, password, phone, city, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, firstName || "", lastName || "", email, hashedPassword, phone || "", city || "", country || ""]
  );

  return mapUser(result.rows[0]);
};

const findById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return mapUser(result.rows[0]);
};

const updateById = async (id, payload) => {
  const fields = [];
  const values = [];

  const fieldMap = {
    name: "name",
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    phone: "phone",
    city: "city",
    country: "country",
    avatar: "avatar"
  };

  Object.entries(fieldMap).forEach(([key, column]) => {
    if (payload[key] !== undefined) {
      values.push(payload[key]);
      fields.push(`${column} = $${values.length}`);
    }
  });

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);
  const result = await db.query(
    `UPDATE users
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return mapUser(result.rows[0]);
};

module.exports = {
  create,
  findByEmail,
  findById,
  updateById
};
