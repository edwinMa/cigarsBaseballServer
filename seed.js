// seed.js - Creates the default admin account
// Usage: node seed.js
// Requires DATABASE_URL, ADMIN_EMAIL env vars (or .env file)

require('dotenv').config();
const pool = require('./db');

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cigarsbaseball.org';

  console.log('Seeding admin account:', adminEmail);

  try {
    const result = await pool.query(
      `INSERT INTO users (email, role)
       VALUES ($1, 'admin')
       ON CONFLICT (email) DO UPDATE SET role = 'admin'
       RETURNING id, email, role`,
      [adminEmail.toLowerCase()]
    );

    const user = result.rows[0];
    console.log('Admin user created/updated:', user);

    // Ensure admin is on whitelist (approved) so OTP login works
    const wlCheck = await pool.query('SELECT id FROM whitelist WHERE LOWER(email) = LOWER($1)', [adminEmail]);
    if (wlCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO whitelist (email, status, notes) VALUES ($1, 'approved', 'Admin account')",
        [adminEmail.toLowerCase()]
      );
    } else {
      await pool.query("UPDATE whitelist SET status = 'approved' WHERE LOWER(email) = LOWER($1)", [adminEmail]);
    }

    // Create admin player profile if not exists
    const existing = await pool.query('SELECT id FROM players WHERE user_id = $1', [user.id]);
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO players (user_id, first_name, last_name, email) VALUES ($1, $2, $3, $4)',
        [user.id, 'Admin', 'User', adminEmail.toLowerCase()]
      );
      console.log('Admin player profile created');
    } else {
      console.log('Admin player profile already exists');
    }

    // Seed default notification settings if not exists
    await pool.query(
      `INSERT INTO notification_settings (id, days_before, default_message, send_email, send_sms)
       VALUES (1, 5, 'Please respond with your availability for the upcoming game on {game_date} at {game_time}.', true, true)
       ON CONFLICT (id) DO NOTHING`
    );
    console.log('Notification settings seeded');

    console.log('\nSeed complete!');
    console.log(`Admin login: enter ${adminEmail} at the sign-in screen to receive a one-time code.`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

seed();
