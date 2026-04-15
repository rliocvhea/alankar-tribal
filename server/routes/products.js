import express from 'express';
import database from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let queryStr = 'SELECT * FROM products WHERE stock > 0';
    const params = [];
    let paramIndex = 1;

    if (category) {
      queryStr += ` AND category = ${database.pool ? '$' + paramIndex++ : '?'}`;
      params.push(category);
    }

    if (search) {
      queryStr += ` AND (name LIKE ${database.pool ? '$' + paramIndex++ : '?'} OR description LIKE ${database.pool ? '$' + paramIndex++ : '?'})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const result = await database.query(queryStr, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const param = database.pool ? '$1' : '?';
    const result = await database.query(`SELECT * FROM products WHERE id = ${param}`, [req.params.id]);
    const product = result.rows[0];
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, wholesale_price, min_wholesale_qty, category, image_url, stock } = req.body;
    const params = [name, description, price, wholesale_price || null, min_wholesale_qty || 10, category, image_url, stock || 0];
    
    const queryStr = database.pool
      ? 'INSERT INTO products (name, description, price, wholesale_price, min_wholesale_qty, category, image_url, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id'
      : 'INSERT INTO products (name, description, price, wholesale_price, min_wholesale_qty, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    const result = await database.query(queryStr, params);
    const id = database.pool ? result.rows[0].id : result.lastID;
    
    res.status(201).json({ id, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, wholesale_price, min_wholesale_qty, category, image_url, stock } = req.body;
    const params = [name, description, price, wholesale_price || null, min_wholesale_qty || 10, category, image_url, stock, req.params.id];
    
    const queryStr = database.pool
      ? 'UPDATE products SET name = $1, description = $2, price = $3, wholesale_price = $4, min_wholesale_qty = $5, category = $6, image_url = $7, stock = $8 WHERE id = $9'
      : 'UPDATE products SET name = ?, description = ?, price = ?, wholesale_price = ?, min_wholesale_qty = ?, category = ?, image_url = ?, stock = ? WHERE id = ?';
    
    await database.query(queryStr, params);
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const param = database.pool ? '$1' : '?';
    await database.query(`DELETE FROM products WHERE id = ${param}`, [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router;
