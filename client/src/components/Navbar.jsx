import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛍️</span>
            <span className="text-2xl font-bold text-primary">Alankara Tribal</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-primary transition">Products</Link>
          </div>

          <div className="flex items-center space-x-4">
            {user?.role !== 'admin' && (
              <Link to="/cart" className="relative">
                <span className="text-2xl">🛒</span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link to="/orders" className="text-gray-700 hover:text-primary transition hidden md:block">
                    Orders
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary transition hidden md:block">
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-primary transition hidden md:block">
                  {user.name}
                </Link>
                <button onClick={logout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
