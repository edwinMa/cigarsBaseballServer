// rosterDB.js - DB-backed roster operations
// Use this for new DB-driven roster features; original roster.js remains unchanged.
const pool = require('./db');

async function getRosterDB(seasonId) {
  let query = `
    SELECT p.*, sr.is_active as roster_active
    FROM players p
    LEFT JOIN season_rosters sr ON p.id = sr.player_id
  `;
  const params = [];
  if (seasonId) {
    query += ' WHERE sr.season_id = $1 AND sr.is_active = true';
    params.push(seasonId);
  } else {
    query += ' WHERE p.is_active = true';
  }
  query += ' ORDER BY p.last_name, p.first_name';
  const result = await pool.query(query, params);
  return result.rows;
}

async function getPlayerByUserId(userId) {
  const result = await pool.query('SELECT * FROM players WHERE user_id = $1', [userId]);
  return result.rows[0] || null;
}

module.exports = { getRosterDB, getPlayerByUserId };
