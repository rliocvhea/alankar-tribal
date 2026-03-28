import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const category = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      
      const response = await axios.get('/api/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchProductsBySearch();
    } else {
      fetchProducts();
    }
  };

  const fetchProductsBySearch = async () => {
    try {
      const response = await axios.get('/api/products', { params: { search } });
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const categories = ['Electronics', 'Fashion', 'Sports', 'Kitchen', 'Office', 'Home Decor'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            className="input-field flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSearchParams({});
              setSearch('');
            }}
            className={`px-4 py-2 rounded-lg transition ${
              !category ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSearchParams({ category: cat });
                setSearch('');
              }}
              className={`px-4 py-2 rounded-lg transition ${
                category === cat ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No products found</p>
        </div>
      )}
    </div>
  );
}
