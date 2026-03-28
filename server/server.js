import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

import express from 'express';
import cors from 'cors';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
await initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/create-razorpay-order', async (req, res) => {
  try {
      const { amount } = req.body;

      // Log for debugging
      console.log('Creating Razorpay order for amount:', amount);
      console.log('Razorpay Key ID configured:', !!process.env.RAZORPAY_KEY_ID);
      console.log('Razorpay Key Secret configured:', !!process.env.RAZORPAY_KEY_SECRET);

      const options = {
          amount: Math.round(amount * 100), // Convert to integer paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
      };

      const order = await razorpay.orders.create(options);

      res.status(200).send({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      });
  } catch (error) {
      console.error('Error creating Razorpay order:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      res.status(500).send({ 
        error: 'Failed to create Razorpay order', 
        details: error.message || 'Invalid credentials or network error',
        description: error.error?.description || error.description
      });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      const crypto = await import('crypto');
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature === razorpay_signature) {
          res.status(200).send({ success: true, message: 'Payment verified successfully' });
      } else {
          res.status(400).send({ success: false, message: 'Payment verification failed' });
      }
  } catch (error) {
      console.error('Error verifying payment:', error.message);
      res.status(500).send({ error: 'Failed to verify payment', details: error.message });
  }
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

 
