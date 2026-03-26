// scheduleDB.js - DB-backed schedule operations
// Use this for new DB-driven schedule features; original schedule.js remains unchanged.
const pool = require('./db');

async function getScheduleDB(seasonId) {
  let query = 'SELECT * FROM games';
  const params = [];
  if (seasonId) {
    query += ' WHERE season_id = $1';
    params.push(seasonId);
  }
  query += ' ORDER BY game_date ASC, game_time ASC';
  const result = await pool.query(query, params);
  return result.rows;
}

async function getUpcomingGamesDB(daysAhead) {
  const result = await pool.query(
    `SELECT * FROM games
     WHERE game_date >= CURRENT_DATE
       AND game_date <= CURRENT_DATE + INTERVAL '${parseInt(daysAhead)} days'
     ORDER BY game_date ASC, game_time ASC`
  );
  return result.rows;
}

async function getGamesNeedingNotification(daysBefore) {
  // Returns games that are exactly `daysBefore` days from today that haven't been notified yet
  const result = await pool.query(
    `SELECT g.*
     FROM games g
     WHERE g.game_date = CURRENT_DATE + INTERVAL '${parseInt(daysBefore)} days'
     ORDER BY g.game_date ASC`
  );
  return result.rows;
}

module.exports = { getScheduleDB, getUpcomingGamesDB, getGamesNeedingNotification };
