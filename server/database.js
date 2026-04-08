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
        ['Tribal Dancing Figure Frame', 'Handcrafted Dhokra art depicting traditional tribal dance', 149.99, 119.99, 10, 'Dhokra frame', 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400', 25],
        ['Tree of Life Wall Frame', 'Intricate Dhokra metalwork featuring tree of life design', 199.99, 169.99, 8, 'Dhokra frame', 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400', 18],
        ['Warli Art Dhokra Frame', 'Traditional Warli patterns in Dhokra bronze frame', 179.99, 149.99, 10, 'Dhokra frame', 'https://images.unsplash.com/photo-1594643781809-7c4ca3f0ef94?w=400', 22],
        ['Musical Ensemble Frame', 'Tribal musicians depicted in authentic Dhokra craft', 159.99, 129.99, 12, 'Dhokra frame', 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400', 20],
        ['Dhokra Necklace Set', 'Traditional tribal necklace with matching earrings', 89.99, 72.99, 15, 'Jewellery', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', 45],
        ['Tribal Bracelet', 'Handcrafted Dhokra metal bracelet with ethnic design', 49.99, 39.99, 20, 'Jewellery', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', 60],
        ['Bell Metal Earrings', 'Authentic tribal bell metal dangle earrings', 39.99, 32.99, 25, 'Jewellery', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 75],
        ['Dhokra Pendant', 'Unique tribal pattern pendant with adjustable chain', 59.99, 47.99, 18, 'Jewellery', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', 50],
        ['Anklet Pair', 'Traditional tribal anklets with bells', 44.99, 34.99, 20, 'Jewellery', 'https://images.unsplash.com/photo-1588444650700-c5f56538195d?w=400', 55],
        ['Tribal Ring Set', 'Handcrafted Dhokra rings set of 3', 34.99, 26.99, 25, 'Jewellery', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', 80],
        ['Village Scene Frame', 'Dhokra frame depicting traditional village life', 189.99, 159.99, 8, 'Dhokra frame', 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400', 15],
        ['Nose Pin Collection', 'Elegant tribal nose pins set of 5', 29.99, 23.99, 30, 'Jewellery', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400', 90],
        ['Tribal Choker Necklace', 'Statement choker with traditional motifs', 79.99, 64.99, 15, 'Jewellery', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400', 40],
        ['Nature Motif Frame', 'Dhokra artwork featuring flora and fauna', 169.99, 139.99, 10, 'Dhokra frame', 'https://images.unsplash.com/photo-1594643781809-7c4ca3f0ef94?w=400', 20],
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
