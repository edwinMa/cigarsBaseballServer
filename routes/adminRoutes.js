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
      `SELECT w.*, ab.email as added_by_email,
              lu.last_login_at
       FROM whitelist w
       LEFT JOIN users ab ON w.added_by = ab.id
       LEFT JOIN users lu ON (w.phone IS NOT NULL AND lu.phone = w.phone)
                          OR (w.email IS NOT NULL AND LOWER(lu.email) = LOWER(w.email))
       ORDER BY w.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

function normalizePhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  return phone;
}

// POST /cigarsbaseball/admin/whitelist
router.post('/whitelist', requireAdmin, async (req, res) => {
  const { email, phone, name, notes } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: 'email or phone required' });
  }
  try {
    const result = await pool.query(
      "INSERT INTO whitelist (email, phone, added_by, status, name, notes) VALUES ($1, $2, $3, 'approved', $4, $5) RETURNING *",
      [email ? email.toLowerCase() : null, phone ? normalizePhone(phone) : null, req.user.id, name || null, notes || null]
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

// --- OPPONENTS ---

pool.query(`
  CREATE TABLE IF NOT EXISTS opponents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age_division VARCHAR(10) NOT NULL DEFAULT '25+',
    manager_name VARCHAR(255),
    manager_phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`).catch(err => console.error('Failed to create opponents table:', err));

router.get('/opponents', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM opponents ORDER BY name');
    res.json(result.rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/opponents', requireAdmin, async (req, res) => {
  const { name, age_division, manager_name, manager_phone } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const result = await pool.query(
      "INSERT INTO opponents (name, age_division, manager_name, manager_phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, age_division || '25+', manager_name || null, manager_phone || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.put('/opponents/:id', requireAdmin, async (req, res) => {
  const { name, age_division, manager_name, manager_phone } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const result = await pool.query(
      'UPDATE opponents SET name=$1, age_division=$2, manager_name=$3, manager_phone=$4 WHERE id=$5 RETURNING *',
      [name, age_division || '25+', manager_name || null, manager_phone || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/opponents/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM opponents WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
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

// Auto-add pre_game_message column if missing
pool.query(`ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS pre_game_message TEXT`).catch(() => {});

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
  const { daysBefore, defaultMessage, sendEmail, sendSms, preGameMessage } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO notification_settings (id, days_before, default_message, send_email, send_sms, pre_game_message, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id) DO UPDATE SET
         days_before = EXCLUDED.days_before,
         default_message = EXCLUDED.default_message,
         send_email = EXCLUDED.send_email,
         send_sms = EXCLUDED.send_sms,
         pre_game_message = EXCLUDED.pre_game_message,
         updated_at = NOW()
       RETURNING *`,
      [daysBefore ?? 5, defaultMessage ?? 'Please respond with your availability for the upcoming game on {game_date} at {game_time}.', sendEmail ?? true, sendSms ?? true, preGameMessage ?? 'Game on {game_date} vs {opponent} at {field} at {game_time}. Uniform is {uniform_cap} caps, {uniform_shirt} tops, and {uniform_pants}.']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
