const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// POST /cigarsbaseball/auth/register
// Requires email on whitelist. Creates user + player record.
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'email, password, firstName, and lastName are required' });
  }

  try {
    // Check whitelist
    const wl = await pool.query(
      "SELECT * FROM whitelist WHERE LOWER(email) = LOWER($1) AND status = 'approved'",
      [email]
    );
    if (wl.rows.length === 0) {
      return res.status(403).json({ error: 'Your email is not on the approved whitelist. Please contact the admin or request access.' });
    }

    // Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userResult = await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'player') RETURNING id, email, role",
      [email.toLowerCase(), passwordHash]
    );
    const user = userResult.rows[0];

    // Create player record with basic info
    const playerResult = await pool.query(
      'INSERT INTO players (user_id, first_name, last_name, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [user.id, firstName, lastName, email.toLowerCase(), phone || null]
    );
    const player = playerResult.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, playerId: player.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, playerId: player.id } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /cigarsbaseball/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated. Contact the admin.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const playerResult = await pool.query('SELECT id FROM players WHERE user_id = $1', [user.id]);
    const playerId = playerResult.rows.length > 0 ? playerResult.rows[0].id : null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, playerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role, playerId } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /cigarsbaseball/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, email, role, is_active, created_at FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
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
// Player requests to be added to the whitelist
router.post('/request-whitelist', async (req, res) => {
  const { email, phone, message } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: 'email or phone is required' });
  }

  try {
    // Check if already on whitelist
    const existing = await pool.query(
      'SELECT id FROM whitelist WHERE LOWER(email) = LOWER($1)',
      [email || '']
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'This email is already on the whitelist' });
    }

    await pool.query(
      "INSERT INTO whitelist (email, phone, status, notes) VALUES ($1, $2, 'pending', $3)",
      [email ? email.toLowerCase() : null, phone || null, message || null]
    );

    res.status(201).json({ message: 'Whitelist request submitted. The admin will review your request.' });
  } catch (err) {
    console.error('Whitelist request error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
