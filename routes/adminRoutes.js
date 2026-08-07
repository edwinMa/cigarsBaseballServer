const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const { appendUniform } = require('../services/uniform');

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

const ROSTER_STATUSES = ['active', 'inactive', 'reserve'];

// PATCH /cigarsbaseball/admin/players/:id/roster-status - move a player between roster categories
// body: { status: 'active' | 'inactive' | 'reserve' }
// Only changes roster placement (players.roster_status + synced is_active). Does NOT touch the
// user's login account (users.is_active), so reserve players can still sign in and respond.
router.patch('/players/:id/roster-status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!ROSTER_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${ROSTER_STATUSES.join(', ')}` });
  }
  try {
    const result = await pool.query(
      `UPDATE players
         SET roster_status = $1,
             is_active = $2,
             updated_at = NOW()
       WHERE id = $3
       RETURNING id, first_name, last_name, roster_status, is_active`,
      [status, status === 'active', req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Player not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Roster status update error:', err);
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
// body: {
//   subject, message, channels: ['email','sms'], gameId?,
//   playerIds: 'all' | [id, ...],   // explicit ids target those exact players regardless of status
//                                    // (so reserve/inactive players can be picked individually)
//   audience?: 'active' | 'reserve' | 'active_reserve' | 'all'  // used when playerIds is 'all'/omitted
// }
router.post('/notify', requireAdmin, async (req, res) => {
  const { subject, message, channels, playerIds, gameId, audience, notificationType } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });
  if (!channels || channels.length === 0) return res.status(400).json({ error: 'channels (email/sms) required' });

  try {
    let query;
    if (Array.isArray(playerIds) && playerIds.length > 0) {
      // Explicit selection: send to exactly these players whatever their roster status.
      query = await pool.query('SELECT * FROM players WHERE id = ANY($1)', [playerIds]);
    } else {
      // Group send: choose the roster category. Defaults to active-only (prior behavior).
      const audienceFilters = {
        active: "roster_status = 'active'",
        reserve: "roster_status = 'reserve'",
        active_reserve: "roster_status IN ('active', 'reserve')",
        all: "roster_status <> 'inactive'",
      };
      const where = audienceFilters[audience] || audienceFilters.active;
      query = await pool.query(`SELECT * FROM players WHERE ${where}`);
    }

    const players = query.rows;
    const results = { sent: [], failed: [] };

    // For game-tied sends, append the uniform combination (when one is set).
    let finalMessage = message;
    if (gameId) {
      const gameRes = await pool.query(
        'SELECT uniform_cap, uniform_shirt, uniform_pants FROM games WHERE id = $1',
        [gameId]
      );
      finalMessage = appendUniform(message, gameRes.rows[0]);
    }

    for (const player of players) {
      if (channels.includes('email') && player.email) {
        try {
          await emailService.send({
            to: player.email,
            subject: subject || 'Cigars Baseball Notification',
            text: finalMessage,
            html: `<p>${finalMessage.replace(/\n/g, '<br>')}</p>`
          });
          results.sent.push({ playerId: player.id, channel: 'email' });
          if (gameId) {
            await pool.query(
              'INSERT INTO notification_log (game_id, player_id, channel, status, notification_type) VALUES ($1, $2, $3, $4, $5)',
              [gameId, player.id, 'email', 'sent', notificationType || null]
            ).catch(e => console.error('Failed to log notification for player', player.id, e.message));
          }
        } catch (e) {
          results.failed.push({ playerId: player.id, channel: 'email', error: e.message });
        }
      }
      if (channels.includes('sms') && player.phone) {
        try {
          const msg = await smsService.send(player.phone, finalMessage);
          results.sent.push({ playerId: player.id, channel: 'sms' });
          if (gameId) {
            // Record the Twilio SID + initial status; the status-callback webhook fills in delivery.
            await pool.query(
              'INSERT INTO notification_log (game_id, player_id, channel, status, provider_sid, notification_type) VALUES ($1, $2, $3, $4, $5, $6)',
              [gameId, player.id, 'sms', msg?.status || 'sent', msg?.sid || null, notificationType || null]
            ).catch(e => console.error('Failed to log notification for player', player.id, e.message));
          }
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

// Schema migrations
pool.query(`ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS pre_game_message TEXT`).catch(() => {});
// Uniform is now appended automatically at send time (services/uniform.js), so
// strip the legacy inline "Uniform is ..." sentence from the stored template.
pool.query(`UPDATE notification_settings
              SET pre_game_message = TRIM(REGEXP_REPLACE(pre_game_message, '\\s*Uniform is[^.]*\\.', '', 'gi'))
            WHERE pre_game_message ~* 'Uniform is'`).catch(() => {});
pool.query(`ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS days_before_2 INT DEFAULT 2`).catch(() => {});
pool.query(`ALTER TABLE notification_log ADD COLUMN IF NOT EXISTS notification_type VARCHAR(20)`).catch(() => {});
// Twilio message SID, used to match delivery-status callbacks back to a log row.
pool.query(`ALTER TABLE notification_log ADD COLUMN IF NOT EXISTS provider_sid VARCHAR(64)`).catch(() => {});
pool.query(`CREATE INDEX IF NOT EXISTS idx_notification_log_provider_sid ON notification_log (provider_sid)`).catch(() => {});

// Roster status: three-way category (active / inactive / reserve). Backfill from the legacy
// is_active boolean, then keep is_active synced so all existing "active roster" queries keep working.
(async () => {
  try {
    await pool.query(`ALTER TABLE players ADD COLUMN IF NOT EXISTS roster_status VARCHAR(10) NOT NULL DEFAULT 'active'`);
    await pool.query(`
      ALTER TABLE players DROP CONSTRAINT IF EXISTS players_roster_status_check;
      ALTER TABLE players ADD CONSTRAINT players_roster_status_check
        CHECK (roster_status IN ('active', 'inactive', 'reserve'));
    `);
    // One-time backfill: only touch rows still at the default where is_active says otherwise.
    await pool.query(`UPDATE players SET roster_status = 'inactive' WHERE is_active = false AND roster_status = 'active'`);
  } catch (err) {
    console.error('Failed roster_status migration:', err.message);
  }
})();

// Normalize all whitelist phone numbers to +1XXXXXXXXXX format
pool.query(`
  UPDATE whitelist SET phone = '+1' || REGEXP_REPLACE(phone, '[^0-9]', '', 'g')
  WHERE phone IS NOT NULL
    AND phone NOT LIKE '+%'
    AND LENGTH(REGEXP_REPLACE(phone, '[^0-9]', '', 'g')) = 10
`).catch(err => console.error('Whitelist phone normalization (10-digit):', err));

pool.query(`
  UPDATE whitelist SET phone = '+' || REGEXP_REPLACE(phone, '[^0-9]', '', 'g')
  WHERE phone IS NOT NULL
    AND phone NOT LIKE '+%'
    AND LENGTH(REGEXP_REPLACE(phone, '[^0-9]', '', 'g')) = 11
    AND LEFT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 1) = '1'
`).catch(err => console.error('Whitelist phone normalization (11-digit):', err));

// GET /cigarsbaseball/admin/notification-settings
// POST /cigarsbaseball/admin/trigger-game-reminders
router.post('/trigger-game-reminders', requireAdmin, async (req, res) => {
  try {
    const { sendGameNotifications } = require('../services/notificationScheduler');
    await sendGameNotifications();
    res.json({ message: 'Game reminders triggered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to trigger game reminders' });
  }
});

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
  const { daysBefore, daysBefore2, defaultMessage, sendEmail, sendSms, preGameMessage } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO notification_settings (id, days_before, days_before_2, default_message, send_email, send_sms, pre_game_message, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id) DO UPDATE SET
         days_before = EXCLUDED.days_before,
         days_before_2 = EXCLUDED.days_before_2,
         default_message = EXCLUDED.default_message,
         send_email = EXCLUDED.send_email,
         send_sms = EXCLUDED.send_sms,
         pre_game_message = EXCLUDED.pre_game_message,
         updated_at = NOW()
       RETURNING *`,
      [daysBefore ?? 4, daysBefore2 ?? 2, defaultMessage ?? 'Please respond with your availability for the upcoming game on {game_date} at {game_time}.', sendEmail ?? true, sendSms ?? true, preGameMessage ?? 'Game on {game_date} vs {opponent} at {field} at {game_time}.']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/admin/notifications/pending
// Returns upcoming games with their notification send status
router.get('/notifications/pending', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.id AS game_id,
        g.game_date,
        g.game_time,
        g.opponent,
        g.field,
        ns.days_before,
        ns.days_before_2,
        (g.game_date::date - (ns.days_before || ' days')::interval)::date AS notify_date_1,
        EXISTS(
          SELECT 1 FROM notification_log nl
          WHERE nl.game_id = g.id
            AND (nl.notification_type = 'reminder_1' OR nl.notification_type IS NULL)
        ) AS sent_1,
        (g.game_date::date - (ns.days_before_2 || ' days')::interval)::date AS notify_date_2,
        EXISTS(
          SELECT 1 FROM notification_log nl
          WHERE nl.game_id = g.id AND nl.notification_type = 'reminder_2'
        ) AS sent_2
      FROM games g, notification_settings ns
      WHERE ns.id = 1
        AND g.game_date >= CURRENT_DATE
      ORDER BY g.game_date ASC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/admin/notifications/log
// Returns per-player notification detail for all logged notifications
router.get('/notifications/log', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.id AS game_id,
        g.game_date,
        g.opponent,
        COALESCE(nl.notification_type, 'reminder_1') AS notification_type,
        MIN(nl.sent_at) AS batch_sent_at,
        p.id AS player_id,
        p.first_name,
        p.last_name,
        STRING_AGG(nl.channel, ', ' ORDER BY nl.channel) AS channels,
        BOOL_OR(nl.status IN ('sent', 'delivered', 'queued', 'sending', 'accepted')) AS any_sent,
        BOOL_AND(nl.status IN ('failed', 'undelivered')) AS all_failed,
        BOOL_OR(nl.status = 'delivered') AS any_delivered,
        STRING_AGG(CASE WHEN nl.status IN ('failed', 'undelivered') THEN nl.error_message END, '; ') AS error_messages,
        ga.response AS availability_response,
        ga.responded_at
      FROM notification_log nl
      JOIN games g ON nl.game_id = g.id
      JOIN players p ON nl.player_id = p.id
      LEFT JOIN game_availability ga
        ON ga.game_id = nl.game_id AND ga.player_id = nl.player_id
      GROUP BY
        g.id, g.game_date, g.opponent,
        COALESCE(nl.notification_type, 'reminder_1'),
        p.id, p.first_name, p.last_name,
        ga.response, ga.responded_at
      ORDER BY MIN(nl.sent_at) DESC, p.last_name, p.first_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/admin/notifications/recent
// Returns last 5 auto-notifications sent (grouped by game + notification type)
router.get('/notifications/recent', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.id AS game_id,
        g.game_date,
        g.opponent,
        COALESCE(nl.notification_type, 'reminder_1') AS notification_type,
        MIN(nl.sent_at) AS sent_at,
        COUNT(*) FILTER (WHERE nl.status = 'sent') AS players_sent
      FROM notification_log nl
      JOIN games g ON nl.game_id = g.id
      GROUP BY g.id, g.game_date, g.opponent, COALESCE(nl.notification_type, 'reminder_1')
      ORDER BY MIN(nl.sent_at) DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
