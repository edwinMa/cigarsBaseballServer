const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /cigarsbaseball/gamesdb/:gameId/availability
// Returns all availability entries with player names for a game (auth required)
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ga.*, p.first_name, p.last_name, p.uniform_number, p.photo_url
       FROM game_availability ga
       JOIN players p ON ga.player_id = p.id
       WHERE ga.game_id = $1
       ORDER BY ga.responded_at`,
      [req.params.gameId]
    );

    // Build pending: all active players who haven't responded
    const allActivePlayers = await pool.query(
      `SELECT id, first_name, last_name, uniform_number, photo_url FROM players WHERE is_active = true ORDER BY last_name, first_name`
    );
    const respondedIds = new Set(result.rows.map(r => r.player_id));
    const pending = allActivePlayers.rows.filter(p => !respondedIds.has(p.id));

    res.json({
      gameId: parseInt(req.params.gameId),
      responses: result.rows,
      pending
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/gamesdb/:gameId/availability/summary
// Returns tab counts only
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT response, COUNT(*) as count FROM game_availability WHERE game_id = $1 GROUP BY response`,
      [req.params.gameId]
    );
    const counts = { yes: 0, no: 0, maybe: 0 };
    result.rows.forEach(r => { counts[r.response] = parseInt(r.count); });

    const activeCount = await pool.query('SELECT COUNT(*) FROM players WHERE is_active = true');
    const respondedCount = await pool.query('SELECT COUNT(*) FROM game_availability WHERE game_id = $1', [req.params.gameId]);
    const pendingCount = parseInt(activeCount.rows[0].count) - parseInt(respondedCount.rows[0].count);

    res.json({ ...counts, pending: Math.max(0, pendingCount) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cigarsbaseball/gamesdb/:gameId/availability
// body: { response: 'yes'|'no'|'maybe', message? }
router.post('/', requireAuth, async (req, res) => {
  const { response, message } = req.body;
  if (!response || !['yes', 'no', 'maybe'].includes(response)) {
    return res.status(400).json({ error: 'response must be yes, no, or maybe' });
  }

  const playerId = req.user.playerId;
  if (!playerId) return res.status(400).json({ error: 'No player profile found for this account' });

  try {
    const result = await pool.query(
      `INSERT INTO game_availability (game_id, player_id, response, message, responded_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (game_id, player_id) DO UPDATE SET
         response = EXCLUDED.response,
         message = EXCLUDED.message,
         responded_at = NOW()
       RETURNING *`,
      [req.params.gameId, playerId, response, message || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /cigarsbaseball/gamesdb/:gameId/availability/:playerId — admin override
router.put('/:playerId', requireAdmin, async (req, res) => {
  const { response, message } = req.body;
  if (!response || !['yes', 'no', 'maybe'].includes(response)) {
    return res.status(400).json({ error: 'response must be yes, no, or maybe' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO game_availability (game_id, player_id, response, message, responded_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (game_id, player_id) DO UPDATE SET
         response = EXCLUDED.response,
         message = EXCLUDED.message,
         responded_at = NOW()
       RETURNING *`,
      [req.params.gameId, req.params.playerId, response, message || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
