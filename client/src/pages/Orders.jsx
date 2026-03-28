import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {user?.role === 'admin' ? 'All Customer Orders' : 'My Orders'}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">
            {user?.role === 'admin' ? 'No orders placed yet' : 'No orders yet'}
          </p>
          {user?.role !== 'admin' && (
            <a href="/products" className="btn-primary">
              Start Shopping
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  {user?.role === 'admin' && order.user_name && (
                    <p className="text-gray-600 text-sm">Customer: {order.user_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-xl font-bold text-primary mt-2">${order.total}</p>
                </div>
              </div>

              <button
                onClick={() => fetchOrderDetails(order.id)}
                className="text-primary hover:underline text-sm"
              >
                View Details
              </button>

              {selectedOrder && selectedOrder.id === order.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span>{item.product_name} x {item.quantity}</span>
                        </div>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Shipping Address:</span> {selectedOrder.shipping_address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
