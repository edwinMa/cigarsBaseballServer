const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// Auto-create table + add last_active_at to users
pool.query(`
  CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`).catch(err => console.error('Failed to create chat_messages table:', err));

pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ`)
  .catch(err => console.error('Failed to add last_active_at:', err));

// GET /cigarsbaseball/chat/players — active roster players with online status
// Online = last_active_at within 3 minutes
router.get('/players', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.first_name, p.last_name, p.uniform_number,
              CASE WHEN u.last_active_at > NOW() - INTERVAL '3 minutes' THEN true ELSE false END AS online
       FROM players p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.is_active = true
       ORDER BY p.first_name, p.last_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/chat/messages/recent — last 100 messages for initial load
// Also updates last_active_at for the current user
router.get('/messages/recent', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [req.user.id]);
    const result = await pool.query(
      `SELECT * FROM (
         SELECT id, user_id, display_name, message, created_at
         FROM chat_messages
         ORDER BY created_at DESC
         LIMIT 100
       ) sub ORDER BY created_at ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/chat/messages?since=<id> — poll for new messages
// Also updates last_active_at so user stays "online" while on the page
router.get('/messages', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [req.user.id]);
    const since = parseInt(req.query.since) || 0;
    const result = await pool.query(
      `SELECT id, user_id, display_name, message, created_at
       FROM chat_messages
       WHERE id > $1
       ORDER BY created_at ASC
       LIMIT 200`,
      [since]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cigarsbaseball/chat/messages
router.post('/messages', requireAuth, async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: 'message required' });
  if (message.trim().length > 1000) return res.status(400).json({ error: 'message too long (max 1000 chars)' });

  try {
    await pool.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [req.user.id]);
    const playerResult = await pool.query(
      'SELECT first_name, last_name FROM players WHERE user_id = $1',
      [req.user.id]
    );
    const player = playerResult.rows[0];
    const displayName = player && (player.first_name || player.last_name)
      ? `${player.first_name} ${player.last_name}`.trim()
      : req.user.phone || req.user.email || 'Player';

    const result = await pool.query(
      'INSERT INTO chat_messages (user_id, display_name, message) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, displayName, message.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
