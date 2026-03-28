import express from 'express';
import db from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, (req, res) => {
  const query = req.user.role === 'admin' 
    ? 'SELECT o.*, u.name as user_name, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    : 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
  
  const params = req.user.role === 'admin' ? [] : [req.user.id];

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching orders' });
    }
    res.json(orders);
  });
});

// Get single order with items
router.get('/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    db.all(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [req.params.id],
      (err, items) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching order items' });
        }
        res.json({ ...order, items });
      }
    );
  });
});

// Create order
router.post('/', authenticateToken, (req, res) => {
  const { items, total, shipping_address } = req.body;

  db.run(
    'INSERT INTO orders (user_id, total, shipping_address, status) VALUES (?, ?, ?, ?)',
    [req.user.id, total, shipping_address, 'pending'],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating order' });
      }

      const orderId = this.lastID;
      const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');

      items.forEach(item => {
        stmt.run([orderId, item.product_id, item.quantity, item.price]);
        // Update product stock
        db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
      });

      stmt.finalize();
      res.status(201).json({ id: orderId, message: 'Order created successfully' });
    }
  );
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;

  db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating order status' });
      }
      res.json({ message: 'Order status updated' });
    }
  );
});

export default router;
