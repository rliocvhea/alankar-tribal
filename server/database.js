import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./database.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'customer',
          customer_type TEXT DEFAULT 'retail',
          company_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          wholesale_price REAL,
          min_wholesale_qty INTEGER DEFAULT 10,
          category TEXT,
          image_url TEXT,
          stock INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          total REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          shipping_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Order items table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        )
      `);

      // Create default admin user
      const adminPassword = bcrypt.hashSync('admin123', 10);
      db.run(
        `INSERT OR IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
        ['admin@shophub.com', adminPassword, 'Admin User', 'admin'],
        (err) => {
          if (err) console.error('Admin user creation error:', err);
        }
      );

      // Insert sample products with wholesale pricing
      const sampleProducts = [
        ['Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 79.99, 65.99, 10, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 100],
        ['Smart Watch', 'Feature-rich smartwatch with fitness tracking', 199.99, 169.99, 5, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 50],
        ['Laptop Backpack', 'Durable laptop backpack with multiple compartments', 49.99, 39.99, 12, 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 150],
        ['Running Shoes', 'Comfortable running shoes for daily exercise', 89.99, 72.99, 8, 'Sports', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 200],
        ['Coffee Maker', 'Programmable coffee maker with thermal carafe', 59.99, 47.99, 6, 'Kitchen', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400', 80],
        ['Yoga Mat', 'Non-slip eco-friendly yoga mat', 29.99, 22.99, 15, 'Sports', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 250],
        ['Office Desk Lamp', 'LED desk lamp with adjustable brightness', 39.99, 32.99, 10, 'Office', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 120],
        ['Water Bottle', 'Stainless steel insulated water bottle 750ml', 24.99, 18.99, 20, 'Sports', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 300],
        ['Bluetooth Speaker', 'Portable waterproof bluetooth speaker', 69.99, 54.99, 8, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 100],
        ['Kitchen Knife Set', 'Professional 8-piece stainless steel knife set', 129.99, 99.99, 5, 'Kitchen', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400', 60],
        ['Throw Pillow Set', 'Decorative throw pillows set of 4', 44.99, 34.99, 12, 'Home Decor', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400', 180],
        ['Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 29.99, 23.99, 15, 'Office', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', 200],
        ['T-Shirt Pack', 'Cotton crew neck t-shirts pack of 5', 39.99, 29.99, 20, 'Fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 400],
        ['Plant Pot Set', 'Ceramic plant pots with drainage set of 3', 34.99, 26.99, 10, 'Home Decor', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 150],
        ['Phone Stand', 'Adjustable aluminum phone and tablet stand', 19.99, 14.99, 25, 'Office', 'https://images.unsplash.com/photo-1600087626120-062700394a01?w=400', 250],
        ['Dumbbell Set', 'Adjustable dumbbell set 20kg pair', 119.99, 95.99, 4, 'Sports', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400', 75]
      ];

      const stmt = db.prepare(`INSERT OR IGNORE INTO products (name, description, price, wholesale_price, min_wholesale_qty, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      sampleProducts.forEach(product => stmt.run(product));
      stmt.finalize();

      resolve();
    });
  });
};

export default db;
