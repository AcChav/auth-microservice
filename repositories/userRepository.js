const db = require("../config/db");

class UserRepository {
  async findByEmail(email) {
    const query =
      "SELECT id, email, password_hash, created_at FROM users WHERE email = $1";
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const query = "SELECT id, email, created_at FROM users WHERE id = $1";
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  async createUser(email, passwordHash) {
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at
    `;
    const { rows } = await db.query(query, [email, passwordHash]);
    return rows[0];
  }
}

module.exports = new UserRepository();
