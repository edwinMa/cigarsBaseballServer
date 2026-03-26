const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

// --- WHITELIST ---

// GET /cigarsbaseball/admin/whitelist
router.get('/whitelist', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, u.email as added_by_email
       FROM whitelist w
       LEFT JOIN users u ON w.added_by = u.id
       ORDER BY w.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cigarsbaseball/admin/whitelist
router.post('/whitelist', requireAdmin, async (req, res) => {
  const { email, phone, notes } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: 'email or phone required' });
  }
  try {
    const result = await pool.query(
      "INSERT INTO whitelist (email, phone, added_by, status, notes) VALUES ($1, $2, $3, 'approved', $4) RETURNING *",
      [email ? email.toLowerCase() : null, phone || null, req.user.id, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /cigarsbaseball/admin/whitelist/:id - update status or notes
router.patch('/whitelist/:id', requireAdmin, async (req, res) => {
  const { status, notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE whitelist SET status = COALESCE($1, status), notes = COALESCE($2, notes) WHERE id = $3 RETURNING *',
      [status || null, notes !== undefined ? notes : null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /cigarsbaseball/admin/whitelist/:id
router.delete('/whitelist/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM whitelist WHERE id = $1', [req.params.id]);
    res.json({ message: 'Removed from whitelist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PLAYER MANAGEMENT ---

// GET /cigarsbaseball/admin/players - full list with user info
router.get('/players', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.email as user_email, u.is_active as user_active, u.created_at as registered_at
       FROM players p
       LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.last_name, p.first_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /cigarsbaseball/admin/players/:id/active - toggle user active status
router.patch('/players/:id/active', requireAdmin, async (req, res) => {
  const { isActive } = req.body;
  try {
    const playerResult = await pool.query('SELECT user_id FROM players WHERE id = $1', [req.params.id]);
    if (playerResult.rows.length === 0) return res.status(404).json({ error: 'Player not found' });
    const userId = playerResult.rows[0].user_id;
    await pool.query('UPDATE users SET is_active = $1 WHERE id = $2', [isActive, userId]);
    await pool.query('UPDATE players SET is_active = $1, updated_at = NOW() WHERE id = $2', [isActive, req.params.id]);
    res.json({ message: `Player ${isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- NOTIFICATIONS ---

// POST /cigarsbaseball/admin/notify - send message to players
// body: { subject, message, channels: ['email','sms'], playerIds: [] | 'all' }
router.post('/notify', requireAdmin, async (req, res) => {
  const { subject, message, channels, playerIds } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });
  if (!channels || channels.length === 0) return res.status(400).json({ error: 'channels (email/sms) required' });

  try {
    let query;
    if (playerIds === 'all' || !playerIds) {
      query = await pool.query("SELECT * FROM players WHERE is_active = true");
    } else {
      query = await pool.query('SELECT * FROM players WHERE id = ANY($1) AND is_active = true', [playerIds]);
    }

    const players = query.rows;
    const results = { sent: [], failed: [] };

    for (const player of players) {
      if (channels.includes('email') && player.email) {
        try {
          await emailService.send({
            to: player.email,
            subject: subject || 'Cigars Baseball Notification',
            text: message,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`
          });
          results.sent.push({ playerId: player.id, channel: 'email' });
        } catch (e) {
          results.failed.push({ playerId: player.id, channel: 'email', error: e.message });
        }
      }
      if (channels.includes('sms') && player.phone) {
        try {
          await smsService.send(player.phone, message);
          results.sent.push({ playerId: player.id, channel: 'sms' });
        } catch (e) {
          results.failed.push({ playerId: player.id, channel: 'sms', error: e.message });
        }
      }
    }

    res.json({ message: 'Notifications sent', results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- NOTIFICATION SETTINGS ---

// GET /cigarsbaseball/admin/notification-settings
router.get('/notification-settings', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notification_settings WHERE id = 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /cigarsbaseball/admin/notification-settings
router.put('/notification-settings', requireAdmin, async (req, res) => {
  const { daysBefore, defaultMessage, sendEmail, sendSms } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO notification_settings (id, days_before, default_message, send_email, send_sms, updated_at)
       VALUES (1, $1, $2, $3, $4, NOW())
       ON CONFLICT (id) DO UPDATE SET
         days_before = EXCLUDED.days_before,
         default_message = EXCLUDED.default_message,
         send_email = EXCLUDED.send_email,
         send_sms = EXCLUDED.send_sms,
         updated_at = NOW()
       RETURNING *`,
      [daysBefore ?? 5, defaultMessage ?? 'Please respond with your availability for the upcoming game on {game_date} at {game_time}.', sendEmail ?? true, sendSms ?? true]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
