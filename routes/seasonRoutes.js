const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /cigarsbaseball/seasons
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM seasons ORDER BY year DESC, id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cigarsbaseball/seasons
router.post('/', requireAdmin, async (req, res) => {
  const { name, year, startDate, endDate, isActive } = req.body;
  if (!name || !year) return res.status(400).json({ error: 'name and year are required' });
  try {
    // If activating this season, deactivate others
    if (isActive) {
      await pool.query('UPDATE seasons SET is_active = false');
    }
    const result = await pool.query(
      'INSERT INTO seasons (name, year, start_date, end_date, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, year, startDate || null, endDate || null, isActive || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /cigarsbaseball/seasons/:id
router.put('/:id', requireAdmin, async (req, res) => {
  const { name, year, startDate, endDate, isActive } = req.body;
  try {
    if (isActive) {
      await pool.query('UPDATE seasons SET is_active = false');
    }
    const result = await pool.query(
      `UPDATE seasons SET
        name = COALESCE($1, name),
        year = COALESCE($2, year),
        start_date = COALESCE($3, start_date),
        end_date = COALESCE($4, end_date),
        is_active = COALESCE($5, is_active)
       WHERE id = $6 RETURNING *`,
      [name, year, startDate || null, endDate || null, isActive, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Season not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/seasons/:id/roster
router.get('/:id/roster', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, sr.is_active as roster_active, sr.added_at
       FROM season_rosters sr
       JOIN players p ON sr.player_id = p.id
       WHERE sr.season_id = $1
       ORDER BY p.last_name, p.first_name`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cigarsbaseball/seasons/:id/roster - add player to season
router.post('/:id/roster', requireAdmin, async (req, res) => {
  const { playerId } = req.body;
  if (!playerId) return res.status(400).json({ error: 'playerId required' });
  try {
    const result = await pool.query(
      `INSERT INTO season_rosters (season_id, player_id, is_active)
       VALUES ($1, $2, true)
       ON CONFLICT (season_id, player_id) DO UPDATE SET is_active = true
       RETURNING *`,
      [req.params.id, playerId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /cigarsbaseball/seasons/:id/roster/:playerId
router.delete('/:id/roster/:playerId', requireAdmin, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM season_rosters WHERE season_id = $1 AND player_id = $2',
      [req.params.id, req.params.playerId]
    );
    res.json({ message: 'Player removed from roster' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /cigarsbaseball/seasons/:id/roster/:playerId - toggle active
router.patch('/:id/roster/:playerId', requireAdmin, async (req, res) => {
  const { isActive } = req.body;
  try {
    const result = await pool.query(
      'UPDATE season_rosters SET is_active = $1 WHERE season_id = $2 AND player_id = $3 RETURNING *',
      [isActive, req.params.id, req.params.playerId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Roster entry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
