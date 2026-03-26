// seed.js - Creates the default admin account
// Usage: node seed.js
// Requires DATABASE_URL env var (or .env file)

require('dotenv').config();
const pool = require('./db');

function normalizePhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  return phone;
}

async function seed() {
  const adminPhone = normalizePhone(process.env.ADMIN_PHONE || '4049663238');

  console.log('Seeding admin account with phone:', adminPhone);

  try {
    // Upsert admin user by phone
    let userResult = await pool.query('SELECT id, phone, role FROM users WHERE phone = $1', [adminPhone]);
    let user;
    if (userResult.rows.length > 0) {
      await pool.query('UPDATE users SET role = $1 WHERE phone = $2', ['admin', adminPhone]);
      user = userResult.rows[0];
      console.log('Admin user updated:', user);
    } else {
      const inserted = await pool.query(
        "INSERT INTO users (phone, role) VALUES ($1, 'admin') RETURNING id, phone, role",
        [adminPhone]
      );
      user = inserted.rows[0];
      console.log('Admin user created:', user);
    }

    // Ensure admin phone is on whitelist (approved)
    const wlCheck = await pool.query('SELECT id FROM whitelist WHERE phone = $1', [adminPhone]);
    if (wlCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO whitelist (phone, status, notes) VALUES ($1, 'approved', 'Admin account')",
        [adminPhone]
      );
      console.log('Admin added to whitelist');
    } else {
      await pool.query("UPDATE whitelist SET status = 'approved' WHERE phone = $1", [adminPhone]);
      console.log('Admin whitelist entry confirmed approved');
    }

    // Create admin player profile if not exists
    const existing = await pool.query('SELECT id FROM players WHERE user_id = $1', [user.id]);
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO players (user_id, first_name, last_name, phone) VALUES ($1, $2, $3, $4)',
        [user.id, 'Admin', 'User', adminPhone]
      );
      console.log('Admin player profile created');
    } else {
      console.log('Admin player profile already exists');
    }

    // Seed default notification settings if not exists
    await pool.query(
      `INSERT INTO notification_settings (id, days_before, default_message, send_email, send_sms)
       VALUES (1, 5, 'Cigars Baseball: Game on {game_date} at {game_time} vs {opponent} at {field}. Respond with the following [1] Yes [2] No [3] Maybe', true, true)
       ON CONFLICT (id) DO NOTHING`
    );
    console.log('Notification settings seeded');

    console.log('\nSeed complete!');
    console.log(`Admin login: enter ${adminPhone} at the sign-in screen to receive a code via SMS.`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

seed();
