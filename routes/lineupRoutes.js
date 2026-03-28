const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');

const PITCHING_ROLES = ['SP', 'RP1', 'RP2', 'RP3', 'RP4', 'RP5', 'RP6'];

// Auto-create tables on first load
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

pool.query(`
  CREATE TABLE IF NOT EXISTS game_pitching_lineups (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    pitching_role VARCHAR(10) NOT NULL,
    UNIQUE(game_id, pitching_role),
    UNIQUE(game_id, player_id)
  )
`).catch(err => console.error('Failed to create game_pitching_lineups table:', err));

// GET /cigarsbaseball/gamesdb/:gameId/lineup
// Returns { batting: [...], pitching: [...] }
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [battingResult, pitchingResult] = await Promise.all([
      pool.query(
        `SELECT gl.id, gl.game_id, gl.player_id, gl.batting_order, gl.field_position,
                p.first_name, p.last_name, p.uniform_number, p.positions,
                ga.response as availability
         FROM game_lineups gl
         JOIN players p ON gl.player_id = p.id
         LEFT JOIN game_availability ga ON ga.game_id = gl.game_id AND ga.player_id = gl.player_id
         WHERE gl.game_id = $1
         ORDER BY gl.batting_order`,
        [req.params.gameId]
      ),
      pool.query(
        `SELECT gpl.id, gpl.game_id, gpl.player_id, gpl.pitching_role,
                p.first_name, p.last_name, p.uniform_number, p.positions,
                ga.response as availability
         FROM game_pitching_lineups gpl
         JOIN players p ON gpl.player_id = p.id
         LEFT JOIN game_availability ga ON ga.game_id = gpl.game_id AND ga.player_id = gpl.player_id
         WHERE gpl.game_id = $1
         ORDER BY ARRAY_POSITION($2::text[], gpl.pitching_role)`,
        [req.params.gameId, PITCHING_ROLES]
      ),
    ]);
    res.json({ batting: battingResult.rows, pitching: pitchingResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /cigarsbaseball/gamesdb/:gameId/lineup
// body: { batting: [{ player_id, batting_order, field_position? }], pitching: [{ player_id, pitching_role }] }
router.put('/', requireAdmin, async (req, res) => {
  const { batting = [], pitching = [] } = req.body;
  if (!Array.isArray(batting) || !Array.isArray(pitching)) {
    return res.status(400).json({ error: 'batting and pitching must be arrays' });
  }
  if (batting.length > 15) return res.status(400).json({ error: 'batting lineup cannot exceed 15 spots' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Replace batting lineup
    await client.query('DELETE FROM game_lineups WHERE game_id = $1', [req.params.gameId]);
    for (const entry of batting) {
      await client.query(
        `INSERT INTO game_lineups (game_id, player_id, batting_order, field_position)
         VALUES ($1, $2, $3, $4)`,
        [req.params.gameId, entry.player_id, entry.batting_order, entry.field_position || null]
      );
    }

    // Replace pitching lineup
    await client.query('DELETE FROM game_pitching_lineups WHERE game_id = $1', [req.params.gameId]);
    for (const entry of pitching) {
      if (!PITCHING_ROLES.includes(entry.pitching_role)) continue;
      await client.query(
        `INSERT INTO game_pitching_lineups (game_id, player_id, pitching_role)
         VALUES ($1, $2, $3)`,
        [req.params.gameId, entry.player_id, entry.pitching_role]
      );
    }

    await client.query('COMMIT');

    // Return updated data
    const [battingResult, pitchingResult] = await Promise.all([
      client.query(
        `SELECT gl.id, gl.game_id, gl.player_id, gl.batting_order, gl.field_position,
                p.first_name, p.last_name, p.uniform_number, p.positions,
                ga.response as availability
         FROM game_lineups gl
         JOIN players p ON gl.player_id = p.id
         LEFT JOIN game_availability ga ON ga.game_id = gl.game_id AND ga.player_id = gl.player_id
         WHERE gl.game_id = $1
         ORDER BY gl.batting_order`,
        [req.params.gameId]
      ),
      client.query(
        `SELECT gpl.id, gpl.game_id, gpl.player_id, gpl.pitching_role,
                p.first_name, p.last_name, p.uniform_number, p.positions,
                ga.response as availability
         FROM game_pitching_lineups gpl
         JOIN players p ON gpl.player_id = p.id
         LEFT JOIN game_availability ga ON ga.game_id = gpl.game_id AND ga.player_id = gpl.player_id
         WHERE gpl.game_id = $1
         ORDER BY ARRAY_POSITION($2::text[], gpl.pitching_role)`,
        [req.params.gameId, PITCHING_ROLES]
      ),
    ]);
    res.json({ batting: battingResult.rows, pitching: pitchingResult.rows });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// POST /cigarsbaseball/gamesdb/:gameId/lineup/send
// body: { message, sendToAllActive, sendToBattingLineup, sendToPitchingLineup, playerIds[], opponentId }
router.post('/send', requireAdmin, async (req, res) => {
  const { message, sendToAllActive, sendToBattingLineup, sendToPitchingLineup, playerIds, opponentId, customPhones } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const phoneSet = new Set();

  if (Array.isArray(customPhones)) {
    customPhones.forEach(p => { if (p) phoneSet.add(p) });
  }

  try {
    if (sendToAllActive) {
      const r = await pool.query("SELECT phone FROM players WHERE is_active = true AND phone IS NOT NULL AND phone != ''");
      r.rows.forEach(row => phoneSet.add(row.phone));
    }
    if (sendToBattingLineup) {
      const r = await pool.query(
        "SELECT p.phone FROM game_lineups gl JOIN players p ON gl.player_id = p.id WHERE gl.game_id = $1 AND p.phone IS NOT NULL AND p.phone != ''",
        [req.params.gameId]
      );
      r.rows.forEach(row => phoneSet.add(row.phone));
    }
    if (sendToPitchingLineup) {
      const r = await pool.query(
        "SELECT p.phone FROM game_pitching_lineups gpl JOIN players p ON gpl.player_id = p.id WHERE gpl.game_id = $1 AND p.phone IS NOT NULL AND p.phone != ''",
        [req.params.gameId]
      );
      r.rows.forEach(row => phoneSet.add(row.phone));
    }
    if (Array.isArray(playerIds) && playerIds.length > 0) {
      const r = await pool.query(
        "SELECT phone FROM players WHERE id = ANY($1::int[]) AND phone IS NOT NULL AND phone != ''",
        [playerIds]
      );
      r.rows.forEach(row => phoneSet.add(row.phone));
    }
    if (opponentId) {
      const r = await pool.query('SELECT manager_phone FROM opponents WHERE id = $1', [opponentId]);
      if (r.rows[0]?.manager_phone) phoneSet.add(r.rows[0].manager_phone);
    }

    const phones = [...phoneSet].filter(Boolean);
    if (phones.length === 0) return res.status(400).json({ error: 'No recipients with phone numbers found' });

    const sms = require('../services/smsService');
    const results = await Promise.allSettled(phones.map(phone => sms.send(phone, message)));
    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.json({ message: `Sent to ${sent} recipient${sent !== 1 ? 's' : ''}${failed ? `, ${failed} failed` : ''}`, sent, failed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
