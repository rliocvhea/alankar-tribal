import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PaymentForm from '../components/PaymentForm';

export default function Checkout() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect admin to dashboard
  if (user?.role === 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Access Restricted</h2>
        <p className="text-gray-600 mb-8">As an admin, you cannot place orders. Please use the dashboard to manage your store.</p>
        <Link to="/admin" className="btn-primary">
          Go to Dashboard
        </Link>
      </div>
    );
  }
  
  const isWholesale = user?.customer_type === 'wholesale';
  
  const getItemPrice = (item) => {
    return isWholesale && item.wholesale_price ? item.wholesale_price : item.price;
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = getItemPrice(item);
      return total + (price * item.quantity);
    }, 0);
  };
  
  const hasMinimumQuantityIssues = () => {
    if (!isWholesale) return false;
    return cart.some(item => {
      const minQty = item.min_wholesale_qty || 1;
      return item.quantity < minQty;
    });
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Verify payment on backend
      await axios.post('/api/verify-payment', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });

      // Create order after payment verification
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: getItemPrice(item)
        })),
        total: calculateTotal(),
        shipping_address: shippingAddress,
        payment_id: response.razorpay_payment_id
      };

      await axios.post('/api/orders', orderData);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment verification failed');
    }
  };

  const handlePaymentError = (errorMsg) => {
    setError(errorMsg || 'Payment failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasMinimumQuantityIssues()) {
      setError('Some items do not meet minimum wholesale quantity requirements');
      return;
    }

    if (!shippingAddress.trim()) {
      setError('Please enter shipping address');
      return;
    }
    
    setError('');
    // Payment will be handled by PaymentForm component
  };

  useEffect(() => {
    const createRazorpayOrder = async () => {
      try {
        const { data } = await axios.post('/api/create-razorpay-order', {
          amount: calculateTotal(),
        });
        setRazorpayOrder(data);
      } catch (error) {
        console.error('Error creating Razorpay order:', error);
        setError('Failed to initialize payment');
      }
    };

    if (cart.length > 0) {
      createRazorpayOrder();
    }
  }, [cart]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="card p-6 space-y-3">
            {isWholesale && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <p className="text-green-800 font-semibold text-sm">💼 Wholesale Order</p>
                <p className="text-xs text-green-700">{user?.company_name || 'Bulk pricing applied'}</p>
              </div>
            )}
            {cart.map(item => {
              const itemPrice = getItemPrice(item);
              return (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                  {isWholesale && item.wholesale_price && (
                    <span className="text-xs text-green-600 ml-1">(W)</span>
                  )}
                </span>
                <span className="font-semibold">${(itemPrice * item.quantity).toFixed(2)}</span>
              </div>
              );
            })}
            <div className="border-t pt-3 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={user?.name}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>

              {isWholesale && user?.company_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={user.company_name}
                    disabled
                    className="input-field bg-gray-100"
                  />
                </div>
              )}

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                  id="address"
                  required
                  rows="4"
                  className="input-field"
                  placeholder="Enter your complete shipping address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Payment</h2>
          <div className="card p-6">
            {razorpayOrder ? (
              <PaymentForm 
                orderId={razorpayOrder.orderId}
                amount={razorpayOrder.amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <p className="text-gray-500">Initializing payment...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
