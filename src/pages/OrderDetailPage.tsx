import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Truck, Package, Clock, XCircle } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Order } from '../types';
import ordersData from '../data/orders.json';
import productsData from '../data/products.json';
import { useAuth } from '../context/AuthContext';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundOrder = ordersData.orders.find((o) => o.id === id);
      setOrder(foundOrder || null);
      setIsLoading(false);
    }, 300);
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Button
          onClick={() => navigate(isAdmin ? '/orders' : '/my-orders')}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get product details for order items
  const orderItemsWithProducts = order.items.map((item) => {
    const product = productsData.products.find((p) => p.id === item.productId);
    return {
      ...item,
      product: product || {
        name: 'Unknown Product',
        image: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
    };
  });
  
  return (
    <div className="mb-8">
      <Button
        onClick={() => navigate(isAdmin ? '/orders' : '/my-orders')}
        variant="outline"
        className="mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Order #{order.id}</h1>
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className="ml-2 font-medium text-gray-800">
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                {order.updatedAt !== order.createdAt && (
                  <p className="text-sm text-gray-500">Last updated on {formatDate(order.updatedAt)}</p>
                )}
              </div>
              
              <h2 className="font-semibold text-lg mb-4">Order Items</h2>
              
              <div className="space-y-6">
                {orderItemsWithProducts.map((item) => (
                  <div key={item.productId} className="flex border-b border-gray-200 pb-4">
                    <div className="h-24 w-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                      <div className="flex justify-between items-end mt-1">
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <div className="text-right">
                          <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                          <p className="font-bold text-indigo-700">
                            ${(item.price * item.quantity).toFixed(2)} total
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <h2 className="font-semibold text-lg">Order Summary</h2>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-indigo-700">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
                  <p className="text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                </div>
                
                {isAdmin && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-gray-800 mb-2">Update Order Status</h3>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        // In a real app, this would update the status via API
                        console.log('Status updated to:', e.target.value);
                        setOrder({
                          ...order,
                          status: e.target.value as Order['status'],
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                      className="shadow-sm border-gray-300 p-2 block w-full rounded-md sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;