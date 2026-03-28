# Alankara Tribal - Modern E-Commerce Application

A production-ready full-stack e-commerce application built with React and Express, featuring admin and customer portals, **retail and wholesale pricing**, shopping cart, order management, and secure authentication.

## 🚀 Features

### Customer Features
- **Dual Customer Types**: Retail and Wholesale/Bulk customers
- Browse products across 6 categories (Electronics, Fashion, Sports, Kitchen, Office, Home Decor)
- Search products
- View product details with pricing tiers
- **Wholesale Benefits**: Special bulk pricing with minimum order quantities
- Shopping cart functionality
- User authentication (login/register)
- Place orders with shipping information
- View order history
- Update profile

### Admin Features
- Product management (create, edit, delete)
- Set both retail and wholesale prices
- Configure minimum wholesale quantities
- View all orders
- Update order status
- View customer information
- Dashboard overview

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Express** - Node.js web framework
- **SQLite3** - Lightweight database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Install dependencies:**

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

2. **Environment Configuration:**

The server uses a `.env` file (already created) with:
```
PORT=5001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

⚠️ **Important:** Change `JWT_SECRET` in production!

## 🚦 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on http://localhost:3000

### Option 2: Use VS Code Tasks

Press `Cmd+Shift+P` and run "Tasks: Run Task" then select "Run E-Commerce App" to start both servers.

## 👤 Demo Accounts

### Admin Access
- **Email:** admin@Alankara Tribal.com
- **Password:** admin123

### Customer Access
Register a new account or use the register page to create:
- **Retail Customer**: Regular pricing
- **Wholesale Customer**: Bulk pricing with minimum order quantities (requires company name)

## 📁 Project Structure

```
e-com/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth, Cart)
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/
│   └── package.json
│
├── server/                 # Express backend
│   ├── routes/            # API routes
│   │   ├── auth.js       # Authentication endpoints
│   │   ├── products.js   # Product CRUD
│   │   ├── orders.js     # Order management
│   │   └── users.js      # User profile
│   ├── middleware/        # Custom middleware
│   │   └── auth.js       # JWT verification
│   ├── database.js        # SQLite setup and schema
│   ├── server.js          # Express server
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders (or all for admin)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 UI Features

- Responsive design for mobile, tablet, and desktop
- Modern gradient hero section
- Interactive product cards with hover effects
- **Dual pricing display**: Shows wholesale prices for bulk customers
- **Minimum quantity indicators** for wholesale orders
- Shopping cart with quantity controls and pricing tiers
- Order tracking with status badges
- Admin dashboard for product and order management
- Protected routes for authenticated users
- Loading states and error handling
- Visual indicators for customer type (Retail/Wholesale)

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Role-based access control (admin/customer)
- CORS configuration
- Input validation

## 📝 Database Schema

### Users Table
- id, email, password, name, role, **customer_type**, **company_name**, created_at

### Products Table
- id, name, description, price, **wholesale_price**, **min_wholesale_qty**, category, image_url, stock, created_at

### Orders Table
- id, user_id, total, status, shipping_address, created_at

### Order Items Table
- id, order_id, product_id, quantity, price

## 🌟 Key Features Implementation

1. **Authentication Flow:** JWT tokens stored in localStorage, axios interceptors for auth headers
2. **Dual Pricing System:** Automatic price switching based on customer type (retail/wholesale)
3. **Minimum Order Quantities:** Enforced for wholesale customers with validation
4. **Shopping Cart:** LocalStorage persistence, Context API for state management, dynamic pricing
5. **Product Management:** Full CRUD operations with wholesale pricing support
6. **Order Processing:** Multi-step checkout, order history, status tracking
7. **Admin Dashboard:** Separate portal for product/order management with bulk pricing controls
8. **Category System:** 6 main categories (Electronics, Fashion, Sports, Kitchen, Office, Home Decor)

## 🚀 Production Deployment

1. Update environment variables (especially JWT_SECRET)
2. Build frontend: `cd client && npm run build`
3. Serve static files from Express or use a CDN
4. Use a production database (PostgreSQL, MySQL, or keep SQLite)
5. Enable HTTPS
6. Configure proper CORS settings
7. Set up monitoring and logging

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.
