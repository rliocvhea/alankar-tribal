import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, email, name, role, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name } = req.body;

  db.run('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating profile' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
});

export default router;
