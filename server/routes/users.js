import express from 'express';
import database from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const param = database.pool ? '$1' : '?';
    const result = await database.query(
      `SELECT id, email, name, role, created_at FROM users WHERE id = ${param}`,
      [req.user.id]
    );
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const params = [name, req.user.id];
    
    const queryStr = database.pool
      ? 'UPDATE users SET name = $1 WHERE id = $2'
      : 'UPDATE users SET name = ? WHERE id = ?';
    
    await database.query(queryStr, params);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;
