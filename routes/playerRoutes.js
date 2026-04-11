const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const VALID_POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'Util', 'IF/OF'];

// GET /cigarsbaseball/players - list all players (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.email as user_email, u.role, u.is_active as user_active
       FROM players p
       LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.last_name, p.first_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get players error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cigarsbaseball/players/:id - get a player profile
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const playerId = parseInt(req.params.id);
    // Players can only view their own profile unless admin
    if (req.user.role !== 'admin' && req.user.playerId !== playerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query('SELECT * FROM players WHERE id = $1', [playerId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get player error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /cigarsbaseball/players/:id - update player profile
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const playerId = parseInt(req.params.id);
    if (req.user.role !== 'admin' && req.user.playerId !== playerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      firstName, lastName, email, phone, dateOfBirth, uniformNumber,
      positions, shirtSize, capSize, hometown, walkUpSong,
      bats, throws, instagram, photoUrl, isActive
    } = req.body;

    // Filter positions to only valid values (don't hard-reject — imported data may have legacy values)
    let cleanPositions = positions;
    if (positions) {
      if (!Array.isArray(positions) || positions.length > 4) {
        return res.status(400).json({ error: 'positions must be an array of up to 4 values' });
      }
      cleanPositions = positions.filter(p => VALID_POSITIONS.includes(p));
    }

    const fields = [];
    const values = [];
    let idx = 1;

    const addField = (col, val) => {
      if (val !== undefined) {
        fields.push(`${col} = $${idx++}`);
        values.push(val);
      }
    };

    addField('first_name', firstName);
    addField('last_name', lastName);
    addField('email', email ? email.toLowerCase() : email);
    addField('phone', phone);
    addField('date_of_birth', dateOfBirth || null);
    addField('uniform_number', uniformNumber || null);
    addField('positions', cleanPositions);
    addField('shirt_size', shirtSize);
    addField('cap_size', capSize);
    addField('hometown', hometown);
    addField('walk_up_song', walkUpSong);
    addField('bats', bats);
    addField('throws', throws);
    addField('instagram', instagram);
    addField('photo_url', photoUrl);
    // Only admin can change is_active
    if (req.user.role === 'admin' && isActive !== undefined) {
      addField('is_active', isActive);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(playerId);

    const result = await pool.query(
      `UPDATE players SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update player error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /cigarsbaseball/players/:id - admin delete player
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM notification_log WHERE player_id = $1', [req.params.id]);
    const result = await pool.query('DELETE FROM players WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json({ message: 'Player deleted' });
  } catch (err) {
    console.error('Delete player error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /cigarsbaseball/players/:id/toggle-active - admin toggle active status
router.patch('/:id/toggle-active', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE players SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 RETURNING id, first_name, last_name, is_active',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Toggle active error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
