const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');
const sms = require('../services/smsService');
const email = require('../services/emailService');

// POST /cigarsbaseball/auth/request-code
// Send 6-digit login code to phone or email if whitelisted
router.post('/request-code', async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: 'Phone or email is required' });

  const isPhone = /^[\+\d][\d\s\-\(\)]{6,}$/.test(identifier.trim());
  const normalizedId = isPhone ? normalizePhone(identifier) : identifier.trim().toLowerCase();

  try {
    // Check whitelist
    const wlQuery = isPhone
      ? "SELECT * FROM whitelist WHERE phone = $1 AND status = 'approved'"
      : "SELECT * FROM whitelist WHERE LOWER(email) = LOWER($1) AND status = 'approved'";
    const wl = await pool.query(wlQuery, [normalizedId]);
    if (wl.rows.length === 0) {
      return res.status(403).json({ error: 'Not on the approved whitelist. Contact the admin or request access.' });
    }

    // Invalidate old unused codes for this identifier
    await pool.query('UPDATE auth_codes SET used = TRUE WHERE identifier = $1 AND used = FALSE', [normalizedId]);

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`>>> LOGIN CODE for ${normalizedId}: ${code}`);
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await pool.query(
      'INSERT INTO auth_codes (identifier, code_hash, expires_at) VALUES ($1, $2, $3)',
      [normalizedId, codeHash, expiresAt]
    );

    if (isPhone) {
      await sms.send(normalizedId, `Your Cigars Baseball login code: ${code}. Expires in 10 minutes.`);
      res.json({ message: 'Code sent via SMS', method: 'sms' });
    } else {
      await email.send({
        to: normalizedId,
        subject: 'Your Cigars Baseball Login Code',
        text: `Your login code: ${code}\n\nThis code expires in 10 minutes.\n\nCigars Baseball`,
        html: `<p>Your login code: <strong style="font-size:1.5em">${code}</strong></p><p>This code expires in 10 minutes.</p>`,
      });
      res.json({ message: 'Code sent via email', method: 'email' });
    }
  } catch (err) {
    console.error('request-code error:', err);
    res.status(500).json({ error: 'Failed to send code' });
  }
});

// POST /cigarsbaseball/auth/verify-code
// Verify OTP, create/find user, return JWT
router.post('/verify-code', async (req, res) => {
  const { identifier, code } = req.body;
  if (!identifier || !code) return res.status(400).json({ error: 'identifier and code are required' });

  const isPhone = /^[\+\d][\d\s\-\(\)]{6,}$/.test(identifier.trim());
  const normalizedId = isPhone ? normalizePhone(identifier) : identifier.trim().toLowerCase();
  const codeHash = crypto.createHash('sha256').update(code.trim()).digest('hex');

  console.log('verify-code attempt:', { identifier, normalizedId, codeLength: code.length, codeHash });

  try {
    // Find valid unused code
    const codeResult = await pool.query(
      'SELECT id, identifier, code_hash, used, expires_at FROM auth_codes WHERE identifier = $1 ORDER BY created_at DESC LIMIT 3',
      [normalizedId]
    );
    console.log('DB rows for identifier:', codeResult.rows);
    console.log('Looking for hash:', codeHash);

    const validRow = codeResult.rows.find(r => r.code_hash === codeHash && !r.used && new Date(r.expires_at) > new Date());
    if (!validRow) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    // Mark code used
    await pool.query('UPDATE auth_codes SET used = TRUE WHERE id = $1', [validRow.id]);

    const phone = isPhone ? normalizedId : null;
    const emailAddr = isPhone ? null : normalizedId;

    // Find or create user
    let user;
    const userQuery = phone
      ? 'SELECT * FROM users WHERE phone = $1'
      : 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    const userResult = await pool.query(userQuery, [normalizedId]);

    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is deactivated. Contact the admin.' });
      }
    } else {
      const newUser = await pool.query(
        "INSERT INTO users (email, phone, role) VALUES ($1, $2, 'player') RETURNING id, email, phone, role",
        [emailAddr, phone]
      );
      user = newUser.rows[0];
    }

    // Find or link player record
    let playerId = null;
    let needsProfile = false;

    const existingLink = await pool.query('SELECT id FROM players WHERE user_id = $1', [user.id]);
    if (existingLink.rows.length > 0) {
      playerId = existingLink.rows[0].id;
    } else {
      // Try to link pre-imported player by phone or email
      const preImported = await pool.query(
        "SELECT id FROM players WHERE user_id IS NULL AND (phone = $1 OR (email IS NOT NULL AND email != '' AND LOWER(email) = LOWER($2)))",
        [phone || '', emailAddr || '']
      );
      if (preImported.rows.length > 0) {
        await pool.query(
          'UPDATE players SET user_id = $1, phone = COALESCE($2, phone), updated_at = NOW() WHERE id = $3',
          [user.id, phone, preImported.rows[0].id]
        );
        playerId = preImported.rows[0].id;
      } else {
        // Create minimal player record — user will complete profile
        const newPlayer = await pool.query(
          "INSERT INTO players (user_id, first_name, last_name, email, phone) VALUES ($1, '', '', $2, $3) RETURNING id",
          [user.id, emailAddr, phone]
        );
        playerId = newPlayer.rows[0].id;
        needsProfile = true;
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone, role: user.role, playerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role, playerId },
      needsProfile,
    });
  } catch (err) {
    console.error('verify-code error:', err);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

// GET /cigarsbaseball/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, email, phone, role, is_active, created_at FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = userResult.rows[0];
    const playerResult = await pool.query('SELECT * FROM players WHERE user_id = $1', [user.id]);
    const player = playerResult.rows.length > 0 ? playerResult.rows[0] : null;
    res.json({ user, player });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cigarsbaseball/auth/request-whitelist
router.post('/request-whitelist', async (req, res) => {
  const { phone, email: emailAddr, message } = req.body;
  if (!phone && !emailAddr) return res.status(400).json({ error: 'phone or email is required' });
  try {
    await pool.query(
      "INSERT INTO whitelist (email, phone, status, notes) VALUES ($1, $2, 'pending', $3)",
      [emailAddr ? emailAddr.toLowerCase() : null, phone ? normalizePhone(phone) : null, message || null]
    );
    res.status(201).json({ message: 'Whitelist request submitted. The admin will review your request.' });
  } catch (err) {
    console.error('Whitelist request error:', err);
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

module.exports = router;
