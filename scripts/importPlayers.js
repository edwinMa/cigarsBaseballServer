// scripts/importPlayers.js
// Imports player data from the Cigars Baseball Google Sheet into the DB.
// The sheet is treated as a whitelist pre-populated source; players are added
// to the `whitelist` table (approved) and optionally to `players` (without user_id).
//
// Usage: node scripts/importPlayers.js
// Requires DATABASE_URL in .env
//
// Expected CSV columns (adjust COLUMN_MAP below to match your sheet):
//   first_name, last_name, email, phone, uniform_number, positions,
//   shirt_size, cap_size, hometown, walk_up_song, bats, throws, date_of_birth

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const https = require('https');
const pool = require('../db');

const SHEET_ID = '1eTsh7OBMzEuHCgvKHLQwOojoCe-HmqbLAgZFKh-jzxE';
const GID = '0';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 302 || res.statusCode === 301) {
        return fetchCSV(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseCSV(csv) {
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
  return lines.slice(1).map(line => {
    // Simple CSV parse (handles quoted fields)
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    values.push(current.trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

// Map CSV column names to DB fields — adjust these to match your actual sheet columns
const COLUMN_MAP = {
  first_name: ['first_name', 'firstname', 'first'],
  last_name: ['last_name', 'lastname', 'last'],
  email: ['email', 'email_address'],
  phone: ['phone', 'mobile', 'cell', 'phone_number'],
  uniform_number: ['number', 'uniform_number', 'jersey_number', 'uniform'],
  positions: ['position', 'positions', 'pos'],
  shirt_size: ['shirt_size', 'shirt', 'jersey_size'],
  cap_size: ['cap_size', 'cap', 'hat_size'],
  hometown: ['hometown', 'city', 'from'],
  walk_up_song: ['walk_up_song', 'walkup_song', 'song', 'walk_up'],
  bats: ['bats', 'bat'],
  throws: ['throws', 'throw'],
  date_of_birth: ['dob', 'date_of_birth', 'birthdate', 'birthday']
};

function findValue(row, fieldMappings) {
  for (const key of fieldMappings) {
    if (row[key] !== undefined && row[key] !== '') return row[key];
  }
  return null;
}

async function importPlayers() {
  console.log('Fetching player data from Google Sheet...');
  try {
    const csv = await fetchCSV(CSV_URL);
    const rows = parseCSV(csv);
    console.log(`Found ${rows.length} rows`);

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const firstName = findValue(row, COLUMN_MAP.first_name);
      const lastName = findValue(row, COLUMN_MAP.last_name);
      const email = findValue(row, COLUMN_MAP.email);

      if (!firstName && !lastName) {
        skipped++;
        continue;
      }

      const phone = findValue(row, COLUMN_MAP.phone);
      const uniformNumber = findValue(row, COLUMN_MAP.uniform_number);
      const positionsRaw = findValue(row, COLUMN_MAP.positions);
      const positions = positionsRaw ? positionsRaw.split(/[,/]/).map(p => p.trim()).filter(Boolean) : null;
      const shirtSize = findValue(row, COLUMN_MAP.shirt_size);
      const capSize = findValue(row, COLUMN_MAP.cap_size);
      const hometown = findValue(row, COLUMN_MAP.hometown);
      const walkUpSong = findValue(row, COLUMN_MAP.walk_up_song);
      const bats = findValue(row, COLUMN_MAP.bats);
      const throws = findValue(row, COLUMN_MAP.throws);
      const dob = findValue(row, COLUMN_MAP.date_of_birth);

      // Add to whitelist if email present
      if (email) {
        await pool.query(
          `INSERT INTO whitelist (email, phone, status, notes)
           VALUES ($1, $2, 'approved', 'Imported from Google Sheet')
           ON CONFLICT DO NOTHING`,
          [email.toLowerCase(), phone || null]
        );
      }

      // Insert player record (without user_id — will be linked when they register)
      if (firstName && lastName) {
        await pool.query(
          `INSERT INTO players (first_name, last_name, email, phone, uniform_number, positions,
            shirt_size, cap_size, hometown, walk_up_song, bats, throws, date_of_birth)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT DO NOTHING`,
          [
            firstName, lastName,
            email ? email.toLowerCase() : null,
            phone || null,
            uniformNumber || null,
            positions || null,
            shirtSize || null,
            capSize || null,
            hometown || null,
            walkUpSong || null,
            bats || null,
            throws || null,
            dob || null
          ]
        );
        imported++;
        console.log(`  Imported: ${firstName} ${lastName}`);
      }
    }

    console.log(`\nImport complete: ${imported} players imported, ${skipped} rows skipped`);
    console.log('Players have been added to the whitelist and players table.');
    console.log('When players register with a matching email, their profile will be linked to their account.');
  } catch (err) {
    console.error('Import error:', err);
  } finally {
    await pool.end();
  }
}

importPlayers();
