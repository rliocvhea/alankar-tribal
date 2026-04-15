import express from 'express';
import database from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { sendOrderConfirmation, sendAdminNotification } from '../utils/emailService.js';

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const queryStr = req.user.role === 'admin' 
      ? 'SELECT o.*, u.name as user_name, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
      : database.pool 
        ? 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC'
        : 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
    
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const result = await database.query(queryStr, params);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get single order with items
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const param = database.pool ? '$1' : '?';
    const orderResult = await database.query(`SELECT * FROM orders WHERE id = ${param}`, [req.params.id]);
    const order = orderResult.rows[0];
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const itemsResult = await database.query(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ${param}`,
      [req.params.id]
    );
    
    res.json({ ...order, items: itemsResult.rows });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, total, shipping_address, payment_id } = req.body;
    const params = [req.user.id, total, shipping_address, 'pending'];
    
    const insertOrderQuery = database.pool
      ? 'INSERT INTO orders (user_id, total, shipping_address, status) VALUES ($1, $2, $3, $4) RETURNING id'
      : 'INSERT INTO orders (user_id, total, shipping_address, status) VALUES (?, ?, ?, ?)';
    
    const orderResult = await database.query(insertOrderQuery, params);
    const orderId = database.pool ? orderResult.rows[0].id : orderResult.lastID;

    // Insert order items and update stock
    for (const item of items) {
      const itemParams = [orderId, item.product_id, item.quantity, item.price];
      const insertItemQuery = database.pool
        ? 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)'
        : 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
      
      await database.query(insertItemQuery, itemParams);
      
      // Update product stock
      const stockParams = [item.quantity, item.product_id];
      const updateStockQuery = database.pool
        ? 'UPDATE products SET stock = stock - $1 WHERE id = $2'
        : 'UPDATE products SET stock = stock - ? WHERE id = ?';
      
      await database.query(updateStockQuery, stockParams);
    }

    // Get order details with items for email
    const param = database.pool ? '$1' : '?';
    const finalOrderResult = await database.query(`SELECT * FROM orders WHERE id = ${param}`, [orderId]);
    const order = finalOrderResult.rows[0];
    
    const itemsResult = await database.query(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ${param}`,
      [orderId]
    );
    const orderItems = itemsResult.rows;

    // Update order with payment_id if provided
    if (payment_id) {
      const updateParams = ['confirmed', orderId];
      const updateQuery = database.pool
        ? 'UPDATE orders SET status = $1 WHERE id = $2'
        : 'UPDATE orders SET status = ? WHERE id = ?';
      
      await database.query(updateQuery, updateParams);
      order.status = 'confirmed';
    }

    // Send confirmation email to customer
    try {
      await sendOrderConfirmation(
        req.user.email,
        req.user.name,
        { ...order, payment_id },
        orderItems
      );
      console.log(`Order confirmation email sent to ${req.user.email}`);
    } catch (emailError) {
      console.error('Failed to send order confirmation:', emailError);
    }

    // Send notification to admin
    try {
      await sendAdminNotification(
        { ...order, payment_id },
        orderItems,
        { name: req.user.name, email: req.user.email }
      );
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }

    res.status(201).json({ id: orderId, message: 'Order created successfully' });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const params = [status, req.params.id];
    
    const queryStr = database.pool
      ? 'UPDATE orders SET status = $1 WHERE id = $2'
      : 'UPDATE orders SET status = ? WHERE id = ?';
    
    await database.query(queryStr, params);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

export default router;
