const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Auto-create table on first load
pool.query(`
  CREATE TABLE IF NOT EXISTS game_lineups (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    batting_order INTEGER NOT NULL CHECK (batting_order BETWEEN 1 AND 15),
    field_position VARCHAR(10),
    UNIQUE(game_id, batting_order),
    UNIQUE(game_id, player_id)
  )
`).catch(err => console.error('Failed to create game_lineups table:', err));

// GET /cigarsbaseball/gamesdb/:gameId/lineup
router.get('/', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT gl.id, gl.game_id, gl.player_id, gl.batting_order, gl.field_position,
              p.first_name, p.last_name, p.uniform_number, p.positions,
              ga.response as availability
       FROM game_lineups gl
       JOIN players p ON gl.player_id = p.id
       LEFT JOIN game_availability ga ON ga.game_id = gl.game_id AND ga.player_id = gl.player_id
       WHERE gl.game_id = $1
       ORDER BY gl.batting_order`,
      [req.params.gameId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /cigarsbaseball/gamesdb/:gameId/lineup
// body: { lineup: [{ player_id, batting_order, field_position? }] }
router.put('/', requireAdmin, async (req, res) => {
  const { lineup } = req.body;
  if (!Array.isArray(lineup)) return res.status(400).json({ error: 'lineup must be an array' });
  if (lineup.length > 15) return res.status(400).json({ error: 'lineup cannot exceed 15 spots' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM game_lineups WHERE game_id = $1', [req.params.gameId]);
    for (const entry of lineup) {
      await client.query(
        `INSERT INTO game_lineups (game_id, player_id, batting_order, field_position)
         VALUES ($1, $2, $3, $4)`,
        [req.params.gameId, entry.player_id, entry.batting_order, entry.field_position || null]
      );
    }
    await client.query('COMMIT');

    const result = await client.query(
      `SELECT gl.id, gl.game_id, gl.player_id, gl.batting_order, gl.field_position,
              p.first_name, p.last_name, p.uniform_number, p.positions,
              ga.response as availability
       FROM game_lineups gl
       JOIN players p ON gl.player_id = p.id
       LEFT JOIN game_availability ga ON ga.game_id = gl.game_id AND ga.player_id = gl.player_id
       WHERE gl.game_id = $1
       ORDER BY gl.batting_order`,
      [req.params.gameId]
    );
    res.json(result.rows);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
