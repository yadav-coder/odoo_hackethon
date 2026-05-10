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
    [
      name ?? null,
      firstName ?? null,
      lastName ?? null,
      email ?? null,
      hashedPassword,
      phone ?? null,
      city ?? null,
      country ?? null
    ]
  );
  return mapUser(result.rows[0]);
};

const findById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return mapUser(result.rows[0]);
};

const updateProfile = async (id, payload) => {
  const fields = [];
  const values = [];
  let query = "UPDATE users SET ";

  let i = 1;
  for (const [key, value] of Object.entries(payload)) {
    fields.push(`${key} = $${i}`);
    values.push(value);
    i++;
  }

  if (fields.length === 0) return findById(id);

  query += fields.join(", ") + `, updated_at = NOW() WHERE id = $${i} RETURNING *`;
  values.push(id);

  const result = await db.query(query, values);
  return mapUser(result.rows[0]);
};

module.exports = {
  findByEmail,
  create,
  findById,
  updateProfile
};