import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const isWholesale = user?.customer_type === 'wholesale';
  const displayPrice = isWholesale && product.wholesale_price ? product.wholesale_price : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/products/${product.id}`} className="card overflow-hidden group">
      <div className="relative overflow-hidden h-64">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Only {product.stock} left
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary">${displayPrice}</span>
            {isWholesale && product.wholesale_price && (
              <p className="text-xs text-gray-500 mt-1">Min. {product.min_wholesale_qty} units</p>
            )}
            {!isWholesale && product.wholesale_price && (
              <p className="text-xs text-green-600 mt-1">Bulk pricing available</p>
            )}
          </div>
          {user?.role !== 'admin' ? (
            <button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-semibold"
            >
              Add to Cart
            </button>
          ) : (
            <Link to="/admin" className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Manage
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
}
