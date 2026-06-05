require('dotenv').config();
const cron = require('node-cron');
const pool = require('../db');
const emailService = require('./emailService');
const smsService = require('./smsService');

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

  let playersQuery;
  if (game.season_id) {
    playersQuery = await pool.query(
      `SELECT p.* FROM players p
       JOIN season_rosters sr ON p.id = sr.player_id
       WHERE sr.season_id = $1 AND sr.is_active = true AND p.is_active = true`,
      [game.season_id]
    );
  } else {
    playersQuery = await pool.query('SELECT * FROM players WHERE is_active = true');
  }

  const players = playersQuery.rows;
  console.log(`[Scheduler] Sending ${notificationType} to ${players.length} players for game vs ${game.opponent} on ${game.game_date}`);

  const message = settings.default_message
    .replace('{game_date}', dateTimeStr)
    .replace('{game_time}', dateTimeStr)
    .replace('{opponent}', game.opponent)
    .replace('{field}', game.field || 'TBD');
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
        await smsService.send(player.phone, fullMessage);
        await logNotification(game.id, player.id, 'sms', 'sent', null, notificationType);
      } catch (e) {
        console.error(`[Scheduler] SMS failed for player ${player.id}:`, e.message);
        await logNotification(game.id, player.id, 'sms', 'failed', e.message, notificationType);
      }
    }
  }
}

async function logNotification(gameId, playerId, channel, status, errorMessage, notificationType) {
  try {
    await pool.query(
      'INSERT INTO notification_log (game_id, player_id, channel, status, error_message, notification_type) VALUES ($1, $2, $3, $4, $5, $6)',
      [gameId, playerId, channel, status, errorMessage, notificationType || null]
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
