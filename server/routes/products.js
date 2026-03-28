import express from 'express';
import db from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products (public)
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM products WHERE stock > 0';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.json(products);
  });
});

// Get single product (public)
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, wholesale_price, min_wholesale_qty, category, image_url, stock } = req.body;

  db.run(
    'INSERT INTO products (name, description, price, wholesale_price, min_wholesale_qty, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, wholesale_price || null, min_wholesale_qty || 10, category, image_url, stock || 0],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating product' });
      }
      res.status(201).json({ id: this.lastID, message: 'Product created' });
    }
  );
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, wholesale_price, min_wholesale_qty, category, image_url, stock } = req.body;

  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, wholesale_price = ?, min_wholesale_qty = ?, category = ?, image_url = ?, stock = ? WHERE id = ?',
    [name, description, price, wholesale_price || null, min_wholesale_qty || 10, category, image_url, stock, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating product' });
      }
      res.json({ message: 'Product updated' });
    }
  );
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting product' });
    }
    res.json({ message: 'Product deleted' });
  });
});

export default router;
