import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, customer_type, company_name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const type = customer_type || 'retail';

  db.run(
    'INSERT INTO users (email, password, name, role, customer_type, company_name) VALUES (?, ?, ?, ?, ?, ?)',
    [email, hashedPassword, name, 'customer', type, company_name || null],
    function (err) {
      if (err) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const token = jwt.sign(
        { id: this.lastID, email, role: 'customer', customer_type: type },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: { id: this.lastID, email, name, role: 'customer', customer_type: type, company_name }
      });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, customer_type: user.customer_type },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        customer_type: user.customer_type,
        company_name: user.company_name
      }
    });
  });
});

export default router;
