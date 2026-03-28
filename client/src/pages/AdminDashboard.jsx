import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    wholesale_price: '',
    min_wholesale_qty: '10',
    category: 'Electronics',
    image_url: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      wholesale_price: product.wholesale_price || '',
      min_wholesale_qty: product.min_wholesale_qty || '10',
      category: product.category,
      image_url: product.image_url,
      stock: product.stock
    });
    setShowProductForm(true);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      wholesale_price: '',
      min_wholesale_qty: '10',
      category: 'Electronics',
      image_url: '',
      stock: ''
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Store Management Dashboard</h1>
        <p className="text-gray-600">Manage your products, orders, and customer requests</p>
      </div>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'products' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setShowProductForm(!showProductForm)}
              className="btn-primary"
            >
              {showProductForm ? 'Cancel' : '+ Add New Product'}
            </button>
          </div>

          {showProductForm && (
            <div className="card p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleProductSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retail Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wholesale Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="Optional bulk price"
                    value={formData.wholesale_price}
                    onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min. Wholesale Qty</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.min_wholesale_qty}
                    onChange={(e) => setFormData({ ...formData, min_wholesale_qty: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Sports</option>
                    <option>Kitchen</option>
                    <option>Office</option>
                    <option>Home Decor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows="3"
                    className="input-field"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid gap-4">
            {products.map(product => (
              <div key={product.id} className="card p-4 flex gap-4">
                <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <p className="text-primary font-bold">
                    Retail: ${product.price}
                    {product.wholesale_price && (
                      <span className="text-green-600 text-sm ml-2">
                        | Wholesale: ${product.wholesale_price} (min. {product.min_wholesale_qty})
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm">Customer: {order.user_name} ({order.email})</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">${order.total}</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="mt-2 border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
