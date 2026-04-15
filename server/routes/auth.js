import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import database from '../database.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, customer_type, company_name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const type = customer_type || 'retail';
    const params = [email, hashedPassword, name, 'customer', type, company_name || null];

    const queryStr = database.pool
      ? 'INSERT INTO users (email, password, name, role, customer_type, company_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id'
      : 'INSERT INTO users (email, password, name, role, customer_type, company_name) VALUES (?, ?, ?, ?, ?, ?)';

    const result = await database.query(queryStr, params);
    const userId = database.pool ? result.rows[0].id : result.lastID;

    const token = jwt.sign(
      { id: userId, email, role: 'customer', customer_type: type },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: userId, email, name, role: 'customer', customer_type: type, company_name }
    });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const param = database.pool ? '$1' : '?';
    const result = await database.query(`SELECT * FROM users WHERE email = ${param}`, [email]);
    const user = result.rows[0];

    if (!user) {
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
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
