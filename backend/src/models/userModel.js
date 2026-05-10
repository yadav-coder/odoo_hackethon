const bcrypt = require("bcryptjs");
const db = require("../config/db");

const mapUser = (row, includePassword = false) => {
  if (!row) return null;

  const user = {
    _id: row.id,
    id: row.id,
    name: row.name || `${row.first_name || ''} ${row.last_name || ''}`.trim(),
    firstName: row.first_name,
    lastName: row.last_name,
    username: row.username,
    email: row.email,
    phone: row.phone,
    city: row.city,
    country: row.country,
    avatar: row.avatar || row.profile_image,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

const findByUsername = async (username, includePassword = false) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  return mapUser(result.rows[0], includePassword);
};

const generateUniqueUsername = async (base) => {
  // Sanitize: lowercase, only alphanumeric/underscore
  const sanitized = base.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 20);
  let candidate = sanitized;
  let suffix = 1;
  while (true) {
    const existing = await db.query("SELECT id FROM users WHERE username = $1", [candidate]);
    if (existing.rows.length === 0) return candidate;
    candidate = `${sanitized}${suffix++}`;
  }
};

const create = async ({ name, firstName, lastName, email, password, phone, city, country }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const displayName = name || [firstName, lastName].filter(Boolean).join(" ").trim();
  
  // Auto-generate unique username from email prefix
  const emailPrefix = email.split("@")[0];
  const username = await generateUniqueUsername(emailPrefix);

  const result = await db.query(
    `INSERT INTO users (first_name, last_name, username, email, password, phone, city, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      firstName || displayName || null,
      lastName || null,
      username,
      email,
      hashedPassword,
      phone || null,
      city || null,
      country || null,
    ]
  );
  return mapUser(result.rows[0]);
};

const findById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return mapUser(result.rows[0]);
};

const updateProfile = async (id, payload) => {
  const columnMap = {
    firstName: "first_name",
    lastName: "last_name",
    name: "name",
    email: "email",
    phone: "phone",
    city: "city",
    country: "country",
    avatar: "profile_image",
  };

  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(payload)) {
    const col = columnMap[key] || key;
    fields.push(`${col} = $${i}`);
    values.push(value);
    i++;
  }

  if (fields.length === 0) return findById(id);

  const query = `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${i} RETURNING *`;
  values.push(id);
  const result = await db.query(query, values);
  return mapUser(result.rows[0]);
};

module.exports = {
  findByEmail,
  findByUsername,
  create,
  findById,
  updateProfile,
};