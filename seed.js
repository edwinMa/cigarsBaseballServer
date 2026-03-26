// seed.js - Creates the default admin account
// Usage: node seed.js
// Requires DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD env vars (or .env file)

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cigarsbaseball.org';
  const adminPassword = process.env.ADMIN_PASSWORD || 'CigarsAdmin2024!';

  console.log('Seeding admin account:', adminEmail);

  try {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'
       RETURNING id, email, role`,
      [adminEmail.toLowerCase(), passwordHash]
    );

    const user = result.rows[0];
    console.log('Admin user created/updated:', user);

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
    console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
    console.log('IMPORTANT: Change the admin password immediately after first login!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

seed();
