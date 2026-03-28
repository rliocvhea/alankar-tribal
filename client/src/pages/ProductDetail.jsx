import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const isWholesale = user?.customer_type === 'wholesale';
  const displayPrice = product && isWholesale && product.wholesale_price ? product.wholesale_price : product?.price;
  const minQty = product && isWholesale ? product.min_wholesale_qty : 1;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && isWholesale) {
      setQuantity(product.min_wholesale_qty || 1);
    }
  }, [product, isWholesale]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-primary hover:underline">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              {product.category}
            </span>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-primary mb-2">
              ${displayPrice}
            </div>
            {isWholesale && product.wholesale_price ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 font-semibold">🎉 Wholesale Price Active!</p>
                <p className="text-sm text-green-700">Minimum order: {product.min_wholesale_qty} units</p>
                <p className="text-xs text-gray-600 mt-1">Retail price: ${product.price}</p>
              </div>
            ) : product.wholesale_price ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 font-semibold">💼 Bulk Pricing Available</p>
                <p className="text-sm text-blue-700">Wholesale price: ${product.wholesale_price} (min. {product.min_wholesale_qty} units)</p>
                <p className="text-xs text-gray-600 mt-1">Register as wholesale customer to access bulk pricing</p>
              </div>
            ) : null}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Stock: <span className="font-semibold">{product.stock} available</span>
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity {isWholesale && `(Min. ${minQty})`}
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold"
              >
                -
              </button>
              <input
                type="number"
                min={minQty}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(minQty, Math.min(product.stock, parseInt(e.target.value) || minQty)))}
                className="w-20 text-center border border-gray-300 rounded-lg py-2"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold"
              >
                +
              </button>
            </div>
            {isWholesale && quantity < minQty && (
              <p className="text-red-500 text-sm mt-2">Minimum order quantity is {minQty} units</p>
            )}
          </div>

          {user?.role !== 'admin' ? (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || (isWholesale && quantity < minQty)}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 font-semibold mb-2">Admin View</p>
              <p className="text-sm text-gray-600 mb-3">You are viewing this as the store owner</p>
              <Link to="/admin" className="btn-primary inline-block">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
