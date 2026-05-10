const db = require("../config/db");

const mapPost = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    user: row.user_id,
    trip: row.trip_id,
    title: row.title,
    content: row.content,
    city: row.city,
    country: row.country,
    category: row.category,
    imageUrl: row.image_url,
    author: row.author_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const create = async (userId, payload) => {
  const result = await db.query(
    `INSERT INTO community_posts (user_id, trip_id, title, content, city, country, category, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      userId,
      payload.trip || null,
      payload.title,
      payload.content || "",
      payload.city || "",
      payload.country || "",
      payload.category || "travel",
      payload.imageUrl || ""
    ]
  );

  return mapPost(result.rows[0]);
};

const findAll = async ({ keyword, city, category } = {}) => {
  const values = [];
  const where = [];

  if (keyword) {
    values.push(`%${keyword}%`);
    where.push(`(community_posts.title ILIKE $${values.length} OR community_posts.content ILIKE $${values.length})`);
  }

  if (city) {
    values.push(city);
    where.push(`community_posts.city = $${values.length}`);
  }

  if (category) {
    values.push(category);
    where.push(`community_posts.category = $${values.length}`);
  }

  const result = await db.query(
    `SELECT community_posts.*, users.name AS author_name
     FROM community_posts
     LEFT JOIN users ON users.id = community_posts.user_id
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY community_posts.created_at DESC
     LIMIT 50`,
    values
  );

  return result.rows.map(mapPost);
};

const updateForUser = async (postId, userId, payload) => {
  const fieldMap = {
    trip: "trip_id",
    title: "title",
    content: "content",
    city: "city",
    country: "country",
    category: "category",
    imageUrl: "image_url"
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
    const result = await db.query("SELECT * FROM community_posts WHERE id = $1 AND user_id = $2", [postId, userId]);
    return mapPost(result.rows[0]);
  }

  values.push(postId, userId);
  const result = await db.query(
    `UPDATE community_posts
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values
  );

  return mapPost(result.rows[0]);
};

const deleteForUser = async (postId, userId) => {
  const result = await db.query("DELETE FROM community_posts WHERE id = $1 AND user_id = $2 RETURNING *", [
    postId,
    userId
  ]);
  return mapPost(result.rows[0]);
};

module.exports = {
  create,
  findAll,
  updateForUser,
  deleteForUser
};
