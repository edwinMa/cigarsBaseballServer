require('dotenv').config();
const cron = require('node-cron');
const pool = require('../db');
const emailService = require('./emailService');
const smsService = require('./smsService');
const { appendUniform } = require('./uniform');

// Format a date for display: "Sunday, April 13 at 12:30 PM"
function formatGameDateTime(gameDate, gameTime) {
  const d = new Date(`${gameDate}T${gameTime}`);
  return d.toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York'
  });
}

async function sendGameNotifications() {
  console.log('[Scheduler] Running game notification check at', new Date().toISOString());
  try {
    const settingsResult = await pool.query('SELECT * FROM notification_settings WHERE id = 1');
    const settings = settingsResult.rows[0] || { days_before: 4, days_before_2: 2, default_message: '', send_email: true, send_sms: true };

    const daysBefore1 = settings.days_before ?? 4;
    const daysBefore2 = settings.days_before_2 ?? 2;

    // Find games needing reminder_1 (not yet sent for this game)
    const games1Result = await pool.query(`
      SELECT g.* FROM games g
      WHERE g.game_date = CURRENT_DATE + ($1 || ' days')::interval
        AND NOT EXISTS (
          SELECT 1 FROM notification_log nl
          WHERE nl.game_id = g.id
            AND (nl.notification_type = 'reminder_1' OR nl.notification_type IS NULL)
        )
    `, [daysBefore1]);

    // Find games needing reminder_2 (not yet sent for this game)
    const games2Result = await pool.query(`
      SELECT g.* FROM games g
      WHERE g.game_date = CURRENT_DATE + ($1 || ' days')::interval
        AND NOT EXISTS (
          SELECT 1 FROM notification_log nl
          WHERE nl.game_id = g.id AND nl.notification_type = 'reminder_2'
        )
    `, [daysBefore2]);

    if (games1Result.rows.length === 0 && games2Result.rows.length === 0) {
      console.log('[Scheduler] No games to notify for today');
      return;
    }

    for (const game of games1Result.rows) {
      await notifyPlayersForGame(game, 'reminder_1', settings);
    }
    for (const game of games2Result.rows) {
      await notifyPlayersForGame(game, 'reminder_2', settings);
    }
  } catch (err) {
    console.error('[Scheduler] Error:', err);
  }
}

async function notifyPlayersForGame(game, notificationType, settings) {
  const dateTimeStr = formatGameDateTime(game.game_date, game.game_time);
  const frontendUrl = process.env.FRONTEND_URL || 'https://cigarsbaseball.org';

  // The active roster is the source of truth for who gets game reminders — every
  // active player is notified, regardless of season_rosters membership.
  const playersQuery = await pool.query("SELECT * FROM players WHERE roster_status = 'active'");

  // Only notify players who haven't already responded to this game
  const respondedResult = await pool.query(
    'SELECT player_id FROM game_availability WHERE game_id = $1',
    [game.id]
  );
  const respondedIds = new Set(respondedResult.rows.map(r => r.player_id));
  const players = playersQuery.rows.filter(p => !respondedIds.has(p.id));

  if (players.length === 0) {
    console.log(`[Scheduler] All players already responded for game vs ${game.opponent} — skipping ${notificationType}`);
    return;
  }
  console.log(`[Scheduler] Sending ${notificationType} to ${players.length} non-respondents for game vs ${game.opponent} on ${game.game_date}`);

  const baseMessage = settings.default_message
    .replace('{game_date}', dateTimeStr)
    .replace('{game_time}', dateTimeStr)
    .replace('{opponent}', game.opponent)
    .replace('{field}', game.field || 'TBD');
  // Include the uniform combination when one has been chosen for this game.
  const message = appendUniform(baseMessage, game);
  const fullMessage = `${message}\n\nRespond at: ${frontendUrl}/games/${game.id}`;

  for (const player of players) {
    if (settings.send_email && player.email) {
      try {
        await emailService.send({
          to: player.email,
          subject: `Cigars Baseball: Upcoming Game vs ${game.opponent} on ${dateTimeStr}`,
          text: fullMessage,
          html: `<p>${message.replace(/\n/g, '<br>')}</p><p><a href="${frontendUrl}/games/${game.id}">Click here to respond</a></p>`
        });
        await logNotification(game.id, player.id, 'email', 'sent', null, notificationType);
      } catch (e) {
        console.error(`[Scheduler] Email failed for player ${player.id}:`, e.message);
        await logNotification(game.id, player.id, 'email', 'failed', e.message, notificationType);
      }
    }
    if (settings.send_sms && player.phone) {
      try {
        const msg = await smsService.send(player.phone, fullMessage);
        // Log Twilio's initial status; the status-callback webhook updates it to the final delivery state.
        await logNotification(game.id, player.id, 'sms', msg?.status || 'sent', null, notificationType, msg?.sid || null);
      } catch (e) {
        console.error(`[Scheduler] SMS failed for player ${player.id}:`, e.message);
        await logNotification(game.id, player.id, 'sms', 'failed', e.message, notificationType);
      }
    }
  }
}

async function logNotification(gameId, playerId, channel, status, errorMessage, notificationType, providerSid) {
  try {
    await pool.query(
      'INSERT INTO notification_log (game_id, player_id, channel, status, error_message, notification_type, provider_sid) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [gameId, playerId, channel, status, errorMessage, notificationType || null, providerSid || null]
    );
  } catch (e) {
    console.error('[Scheduler] Failed to log notification:', e.message);
  }
}

function start() {
  // Run every day at 11:00 AM Eastern Time
  cron.schedule('0 11 * * *', sendGameNotifications, {
    timezone: 'America/New_York'
  });
  console.log('[Scheduler] Game notification scheduler started (11:00 AM ET daily)');
}

module.exports = { start, sendGameNotifications };
