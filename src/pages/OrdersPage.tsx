import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderItem from '../components/order/OrderItem';
import ordersData from '../data/orders.json';
import productsData from '../data/products.json';
import { Order, Product } from '../types';
import { Search, Filter } from 'lucide-react';
import Input from '../components/ui/Input';

const OrdersPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Get product name and image lookup
  const productLookup: Record<string, { name: string; image: string }> = {};
  productsData.products.forEach((product: Product) => {
    productLookup[product.id] = {
      name: product.name,
      image: product.image,
    };
  });
  
  useEffect(() => {
    // Filter orders based on user role
    const userOrders = isAdmin
      ? ordersData.orders
      : ordersData.orders.filter((order) => order.userId === user?.id);
    
    setOrders(userOrders);
    setFilteredOrders(userOrders);
  }, [user, isAdmin]);
  
  useEffect(() => {
    let result = orders;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((order) => order.id.toLowerCase().includes(term));
    }
    
    if (statusFilter) {
      result = result.filter((order) => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {isAdmin ? 'Manage Orders' : 'My Orders'}
      </h1>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Filter className="h-5 w-5" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="shadow-sm border-gray-300 pl-10 block w-full rounded-md sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-gray-600">
            {searchTerm || statusFilter
              ? 'No orders match your search criteria.'
              : 'You have no orders yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              products={productLookup}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;