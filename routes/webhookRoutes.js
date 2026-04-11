const express = require('express');
const router = express.Router();
const pool = require('../db');

function normalizePhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  return phone;
}

function twimlResponse(msg) {
  if (msg) return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${msg}</Message></Response>`;
  return `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
}

// POST /cigarsbaseball/webhook/sms
// Receives incoming SMS replies from Twilio and updates game availability
router.post('/sms', async (req, res) => {
  res.type('text/xml');
  try {
    const from = req.body.From;
    const body = (req.body.Body || '').trim();

    if (!from || !body) return res.send(twimlResponse());

    // Map reply to availability response
    let response;
    const lower = body.toLowerCase();
    if (body === '1' || lower === 'yes' || lower === 'y') response = 'yes';
    else if (body === '2' || lower === 'no' || lower === 'n') response = 'no';
    else if (body === '3' || lower === 'maybe' || lower === 'm') response = 'maybe';
    else {
      return res.send(twimlResponse('Reply 1 for Yes, 2 for No, or 3 for Maybe.'));
    }

    const normalizedPhone = normalizePhone(from);

    // Find player by phone — match directly on players table so unlinked (not yet logged in) players are included
    const playerResult = await pool.query(
      `SELECT id AS player_id FROM players
       WHERE is_active = true
         AND phone IS NOT NULL AND phone != ''
         AND REGEXP_REPLACE(phone, '[^0-9]', '', 'g') = REGEXP_REPLACE($1, '[^0-9]', '', 'g')
       LIMIT 1`,
      [normalizedPhone]
    );

    if (playerResult.rows.length === 0) {
      console.warn('Incoming SMS from unknown phone:', normalizedPhone);
      return res.send(twimlResponse());
    }

    const playerId = playerResult.rows[0].player_id;

    // Find the most recent game they were notified about, or next upcoming game
    const gameResult = await pool.query(
      `SELECT COALESCE(
        (SELECT game_id FROM notification_log WHERE player_id = $1 AND game_id IS NOT NULL ORDER BY sent_at DESC LIMIT 1),
        (SELECT id FROM games WHERE game_date >= CURRENT_DATE ORDER BY game_date ASC LIMIT 1)
       ) AS game_id`,
      [playerId]
    );

    const gameId = gameResult.rows[0]?.game_id;
    if (!gameId) {
      return res.send(twimlResponse('No upcoming game found. Contact the admin.'));
    }

    // Upsert availability
    await pool.query(
      `INSERT INTO game_availability (game_id, player_id, response, responded_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (game_id, player_id) DO UPDATE SET response = $3, responded_at = NOW()`,
      [gameId, playerId, response]
    );

    const label = response === 'yes' ? 'Yes ✓' : response === 'no' ? 'No ✗' : 'Maybe';
    console.log(`SMS availability: player ${playerId} → game ${gameId} → ${response}`);
    res.send(twimlResponse(`Got it! Recorded as "${label}" for the upcoming game.`));

  } catch (err) {
    console.error('Webhook SMS error:', err);
    res.send(twimlResponse());
  }
});

module.exports = router;
