const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const smsService = require('../services/smsService');

// Auto-create table + add columns
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

pool.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS image_url TEXT`)
  .catch(err => console.error('Failed to add image_url to chat_messages:', err));

pool.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false`)
  .catch(err => console.error('Failed to add is_pinned to chat_messages:', err));

pool.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMPTZ`)
  .catch(err => console.error('Failed to add pinned_at to chat_messages:', err));

// GET /cigarsbaseball/chat/players — active roster players with online status
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

// GET /cigarsbaseball/chat/pinned — all pinned messages, newest pin first
router.get('/pinned', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cm.id, cm.user_id, cm.display_name, cm.message, cm.image_url, cm.is_pinned, cm.pinned_at, cm.created_at,
              p.uniform_number
       FROM chat_messages cm
       LEFT JOIN players p ON p.user_id = cm.user_id
       WHERE cm.is_pinned = true
       ORDER BY cm.pinned_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /cigarsbaseball/chat/messages/:id/pin — toggle pin (admin only)
router.patch('/messages/:id/pin', requireAdmin, async (req, res) => {
  try {
    const current = await pool.query('SELECT is_pinned FROM chat_messages WHERE id = $1', [req.params.id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    const nowPinned = !current.rows[0].is_pinned;
    const result = await pool.query(
      `UPDATE chat_messages SET is_pinned = $1, pinned_at = $2 WHERE id = $3 RETURNING *`,
      [nowPinned, nowPinned ? new Date() : null, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/chat/messages/recent — last 100 messages for initial load
router.get('/messages/recent', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [req.user.id]);
    const result = await pool.query(
      `SELECT * FROM (
         SELECT cm.id, cm.user_id, cm.display_name, cm.message, cm.image_url, cm.is_pinned, cm.created_at,
                p.uniform_number
         FROM chat_messages cm
         LEFT JOIN players p ON p.user_id = cm.user_id
         ORDER BY cm.created_at DESC
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
router.get('/messages', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [req.user.id]);
    const since = parseInt(req.query.since) || 0;
    const result = await pool.query(
      `SELECT cm.id, cm.user_id, cm.display_name, cm.message, cm.image_url, cm.is_pinned, cm.created_at,
              p.uniform_number
       FROM chat_messages cm
       LEFT JOIN players p ON p.user_id = cm.user_id
       WHERE cm.id > $1
       ORDER BY cm.created_at ASC
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
  const { message, image_url } = req.body;
  const trimmed = message ? message.trim() : '';
  if (!trimmed && !image_url) return res.status(400).json({ error: 'message or image required' });
  if (trimmed.length > 1000) return res.status(400).json({ error: 'message too long (max 1000 chars)' });
  if (image_url && !image_url.startsWith('data:image/') && !/^https?:\/\//i.test(image_url)) {
    return res.status(400).json({ error: 'invalid image_url' });
  }

  // Only admins can trigger a blast
  const isBlast = req.user.role === 'admin' && /@cigarsBlast\b/i.test(trimmed);

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
      'INSERT INTO chat_messages (user_id, display_name, message, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, displayName, trimmed, image_url || null]
    );
    const saved = result.rows[0];

    // Fire-and-forget SMS blast to all active players with a phone number
    if (isBlast) {
      const smsText = trimmed.replace(/@cigarsBlast\b/gi, '').trim();
      const recipients = await pool.query(
        `SELECT p.phone FROM players p WHERE p.is_active = true AND p.phone IS NOT NULL AND p.phone != ''`
      );
      const blastBody = `📣 Cigars Baseball Blast:\n${smsText}`;
      for (const row of recipients.rows) {
        smsService.send(row.phone, blastBody).catch(e => console.error('Blast SMS failed:', row.phone, e.message));
      }
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /cigarsbaseball/chat/messages/:id — owner or admin only
router.delete('/messages/:id', requireAuth, async (req, res) => {
  try {
    const msg = await pool.query('SELECT user_id FROM chat_messages WHERE id = $1', [req.params.id]);
    if (msg.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && msg.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await pool.query('DELETE FROM chat_messages WHERE id = $1', [req.params.id]);
    res.json({ id: parseInt(req.params.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
