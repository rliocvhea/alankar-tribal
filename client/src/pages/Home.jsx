import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Alankara Tribal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Your one-stop destination for quality products at great prices
          </p>
          <Link to="/products" className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition duration-200 inline-block">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe payment processing</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">Premium items selection</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">Bulk Pricing</h3>
              <p className="text-gray-600">Wholesale rates available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Electronics', 'Fashion', 'Sports', 'Kitchen', 'Office', 'Home Decor'].map(category => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="card p-6 text-center hover:scale-105 transition-transform"
              >
                <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8">Join thousands of happy customers today!</p>
          <Link to="/register" className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition duration-200 inline-block">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
