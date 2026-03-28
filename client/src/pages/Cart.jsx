import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect admin to dashboard
  if (user?.role === 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Access Restricted</h2>
        <p className="text-gray-600 mb-8">As an admin, you cannot purchase products. Please use the dashboard to manage your store.</p>
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

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const itemPrice = getItemPrice(item);
            const minQty = isWholesale && item.min_wholesale_qty ? item.min_wholesale_qty : 1;
            
            return (
            <div key={item.id} className="card p-4 flex gap-4">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-primary font-bold mb-2">
                  ${itemPrice}
                  {isWholesale && item.wholesale_price && (
                    <span className="text-xs text-green-600 ml-2">(Wholesale)</span>
                  )}
                </p>
                {isWholesale && minQty > 1 && (
                  <p className="text-xs text-gray-500 mb-2">Min. order: {minQty} units</p>
                )}
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
                  >
                    +
                  </button>
                </div>
                {isWholesale && item.quantity < minQty && (
                  <p className="text-red-500 text-xs mt-2">Minimum {minQty} units required</p>
                )}
              </div>

              <div className="flex flex-col justify-between items-end">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
                <p className="text-xl font-bold">
                  ${(itemPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            {isWholesale && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 font-semibold text-sm">💼 Wholesale Pricing Applied</p>
              </div>
            )}
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{isWholesale ? 'Calculated at checkout' : 'Free'}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
            
            <Link to="/products" className="block text-center mt-4 text-primary hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
