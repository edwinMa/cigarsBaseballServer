// scripts/importPlayers.js
// Imports player data from the Cigars Baseball Google Sheet into the players table.
// Since there is no email column, players are NOT added to the whitelist automatically.
// Add players to the whitelist manually via the admin dashboard before they register.
//
// Usage: node scripts/importPlayers.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const https = require('https');
const pool = require('../db');

const SHEET_ID = '1eTsh7OBMzEuHCgvKHLQwOojoCe-HmqbLAgZFKh-jzxE';
const GID = '0';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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

  // Parse header row
  const headers = parseLine(lines[0]).map(h =>
    h.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  );

  return lines.slice(1).map(line => {
    const values = parseLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = (values[i] || '').trim(); });
    return row;
  });
}

function parseLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { values.push(current); current = ''; }
    else { current += ch; }
  }
  values.push(current);
  return values;
}

// Split "John Smith" → { firstName: "John", lastName: "Smith" }
// Handles "John" → { firstName: "John", lastName: "" }
function splitName(fullName) {
  const parts = (fullName || '').trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}

// Parse positions — may be comma or slash separated e.g. "1B/3B" or "P, OF"
function parsePositions(raw) {
  if (!raw) return null;
  return raw.split(/[,/]/).map(p => p.trim()).filter(Boolean);
}

// Parse date — handles various formats
function parseDate(raw) {
  if (!raw || raw.trim() === '') return null;
  // Try parsing as-is
  const d = new Date(raw.trim());
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return null;
}

async function importPlayers() {
  console.log('Fetching player data from Google Sheet...');
  try {
    const csv = await fetchCSV(CSV_URL);
    const rows = parseCSV(csv);
    console.log(`Found ${rows.length} data rows`);
    console.log('Headers detected:', Object.keys(rows[0] || {}).join(', '));

    let imported = 0;
    let skipped = 0;
    let updated = 0;

    for (const row of rows) {
      // Sheet columns: No., Name, Position, Since, Svc Years, DateOfBirth, Age, Hometown, Shirt SZ, Cap Size, Instagram, Walk Up Song
      const uniformNumber = row['no'] || row['no_'] || null;
      const fullName = row['name'] || '';
      const positionsRaw = row['position'] || row['positions'] || null;
      const dobRaw = row['dateofbirth'] || row['date_of_birth'] || null;
      const hometown = row['hometown'] || null;
      const shirtSize = row['shirt_sz'] || row['shirt_size'] || null;
      const capSize = row['cap_size'] || row['cap_size_'] || null;
      const walkUpSong = row['walk_up_song'] || row['walk_up_song_'] || null;

      if (!fullName || fullName.trim() === '') {
        skipped++;
        continue;
      }

      const { firstName, lastName } = splitName(fullName);
      if (!firstName) { skipped++; continue; }

      const positions = parsePositions(positionsRaw);
      const dateOfBirth = parseDate(dobRaw);

      // Check if player already exists by name
      const existing = await pool.query(
        'SELECT id FROM players WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2) AND user_id IS NULL',
        [firstName, lastName]
      );

      if (existing.rows.length > 0) {
        // Update existing unlinked player record
        await pool.query(
          `UPDATE players SET
            uniform_number = COALESCE($1, uniform_number),
            positions = COALESCE($2, positions),
            date_of_birth = COALESCE($3, date_of_birth),
            hometown = COALESCE($4, hometown),
            shirt_size = COALESCE($5, shirt_size),
            cap_size = COALESCE($6, cap_size),
            walk_up_song = COALESCE($7, walk_up_song),
            updated_at = NOW()
          WHERE id = $8`,
          [uniformNumber, positions, dateOfBirth, hometown, shirtSize, capSize, walkUpSong, existing.rows[0].id]
        );
        console.log(`  Updated: ${firstName} ${lastName}`);
        updated++;
      } else {
        // Insert new player (no user_id — linked when they register)
        await pool.query(
          `INSERT INTO players (first_name, last_name, uniform_number, positions, date_of_birth, hometown, shirt_size, cap_size, walk_up_song)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [firstName, lastName, uniformNumber, positions, dateOfBirth, hometown, shirtSize, capSize, walkUpSong]
        );
        console.log(`  Imported: ${firstName} ${lastName}`);
        imported++;
      }
    }

    console.log(`\nImport complete:`);
    console.log(`  ${imported} players imported`);
    console.log(`  ${updated} players updated`);
    console.log(`  ${skipped} rows skipped`);
    console.log(`\nNext steps:`);
    console.log(`  - Go to the Admin Dashboard → Whitelist tab`);
    console.log(`  - Add each player's email to the whitelist so they can register`);
    console.log(`  - When a player registers with a matching email, their account will be created`);
  } catch (err) {
    console.error('Import error:', err);
  } finally {
    await pool.end();
  }
}

importPlayers();
