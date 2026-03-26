require('dotenv').config();
const cron = require('node-cron');
const pool = require('../db');
const emailService = require('./emailService');
const smsService = require('./smsService');
const { getGamesNeedingNotification } = require('../scheduleDB');

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
    const settings = settingsResult.rows[0] || { days_before: 5, default_message: '', send_email: true, send_sms: true };

    const games = await getGamesNeedingNotification(settings.days_before);
    if (games.length === 0) {
      console.log('[Scheduler] No games to notify for today');
      return;
    }

    for (const game of games) {
      const dateTimeStr = formatGameDateTime(game.game_date, game.game_time);
      const frontendUrl = process.env.FRONTEND_URL || 'https://cigarsbaseball.org';

      // Get active roster players for this game's season (or all active players)
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
      console.log(`[Scheduler] Notifying ${players.length} players about game vs ${game.opponent} on ${game.game_date}`);

      for (const player of players) {
        const message = settings.default_message
          .replace('{game_date}', dateTimeStr)
          .replace('{game_time}', dateTimeStr)
          .replace('{opponent}', game.opponent)
          .replace('{field}', game.field || 'TBD');

        const fullMessage = `${message}\n\nRespond at: ${frontendUrl}/games/${game.id}`;

        // Send email
        if (settings.send_email && player.email) {
          try {
            await emailService.send({
              to: player.email,
              subject: `Cigars Baseball: Upcoming Game vs ${game.opponent} on ${dateTimeStr}`,
              text: fullMessage,
              html: `<p>${message.replace(/\n/g, '<br>')}</p><p><a href="${frontendUrl}/games/${game.id}">Click here to respond</a></p>`
            });
            await logNotification(game.id, player.id, 'email', 'sent', null);
          } catch (e) {
            console.error(`[Scheduler] Email failed for player ${player.id}:`, e.message);
            await logNotification(game.id, player.id, 'email', 'failed', e.message);
          }
        }

        // Send SMS
        if (settings.send_sms && player.phone) {
          try {
            await smsService.send(player.phone, fullMessage);
            await logNotification(game.id, player.id, 'sms', 'sent', null);
          } catch (e) {
            console.error(`[Scheduler] SMS failed for player ${player.id}:`, e.message);
            await logNotification(game.id, player.id, 'sms', 'failed', e.message);
          }
        }
      }
    }
  } catch (err) {
    console.error('[Scheduler] Error:', err);
  }
}

async function logNotification(gameId, playerId, channel, status, errorMessage) {
  try {
    await pool.query(
      'INSERT INTO notification_log (game_id, player_id, channel, status, error_message) VALUES ($1, $2, $3, $4, $5)',
      [gameId, playerId, channel, status, errorMessage]
    );
  } catch (e) {
    console.error('[Scheduler] Failed to log notification:', e.message);
  }
}

function start() {
  // Run every day at 12:30 PM Eastern Time
  cron.schedule('30 12 * * *', sendGameNotifications, {
    timezone: 'America/New_York'
  });
  console.log('[Scheduler] Game notification scheduler started (12:30 PM ET daily)');
}

module.exports = { start, sendGameNotifications };
