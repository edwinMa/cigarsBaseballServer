const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Auto-add uniform columns if missing
pool.query(`ALTER TABLE games ADD COLUMN IF NOT EXISTS uniform_cap VARCHAR(50)`).catch(() => {});
pool.query(`ALTER TABLE games ADD COLUMN IF NOT EXISTS uniform_pants VARCHAR(50)`).catch(() => {});
pool.query(`ALTER TABLE games ADD COLUMN IF NOT EXISTS uniform_shirt VARCHAR(50)`).catch(() => {});

// GET /cigarsbaseball/gamesdb?seasonId=&upcoming=true
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM games';
    const params = [];
    const conditions = [];

    if (req.query.seasonId) {
      conditions.push(`season_id = $${params.length + 1}`);
      params.push(req.query.seasonId);
    }
    if (req.query.upcoming === 'true') {
      conditions.push(`game_date >= CURRENT_DATE`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY game_date ASC, game_time ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/gamesdb/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Game not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cigarsbaseball/gamesdb
router.post('/', requireAdmin, async (req, res) => {
  const { seasonId, gameDate, gameTime, opponent, field, isHome, result: gameResult, score, note, uniformCap, uniformPants, uniformShirt } = req.body;
  if (!gameDate || !gameTime || !opponent) {
    return res.status(400).json({ error: 'gameDate, gameTime, and opponent are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO games (season_id, game_date, game_time, opponent, field, is_home, result, score, note, uniform_cap, uniform_pants, uniform_shirt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [seasonId || null, gameDate, gameTime, opponent, field || '', isHome !== false, gameResult || '', score || '', note || '', uniformCap || null, uniformPants || null, uniformShirt || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /cigarsbaseball/gamesdb/:id
router.put('/:id', requireAdmin, async (req, res) => {
  const { seasonId, gameDate, gameTime, opponent, field, isHome, result: gameResult, score, note, uniformCap, uniformPants, uniformShirt } = req.body;
  try {
    const result = await pool.query(
      `UPDATE games SET
        season_id = COALESCE($1, season_id),
        game_date = COALESCE($2, game_date),
        game_time = COALESCE($3, game_time),
        opponent = COALESCE($4, opponent),
        field = COALESCE($5, field),
        is_home = COALESCE($6, is_home),
        result = COALESCE($7, result),
        score = COALESCE($8, score),
        note = COALESCE($9, note),
        uniform_cap = $10,
        uniform_pants = $11,
        uniform_shirt = $12
       WHERE id = $13 RETURNING *`,
      [seasonId, gameDate, gameTime, opponent, field, isHome, gameResult, score, note, uniformCap || null, uniformPants || null, uniformShirt || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Game not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /cigarsbaseball/gamesdb/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM games WHERE id = $1', [req.params.id]);
    res.json({ message: 'Game deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
