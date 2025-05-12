import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import productsData from '../data/products.json';
import ordersData from '../data/orders.json';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, color }) => (
  <Card className="overflow-hidden">
    <div className={`h-1 ${color}`}></div>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('bg-', 'bg-opacity-20 text-')}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  
  // Get data for dashboard
  const totalProducts = productsData.products.length;
  const totalOrders = ordersData.orders.length;
  const totalRevenue = ordersData.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Get recent orders
  const recentOrders = [...ordersData.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Get products with low stock
  useEffect(() => {
    const lowStock = productsData.products
      .filter((product) => product.quantity < 10)
      .slice(0, 5);
    
    setLowStockProducts(lowStock);
  }, []);
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="h-6 w-6" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="bg-emerald-500"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          description="Items with less than 10 in stock"
          icon={<AlertTriangle className="h-6 w-6" />}
          color="bg-orange-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-indigo-600" />
                Recent Orders
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/orders')}
              >
                View All
              </Button>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium text-indigo-700 mr-4">${order.totalAmount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full 
                        ${order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No recent orders found</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Low Stock Products
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/products')}
              >
                View All
              </Button>
            </div>
            
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                    onClick={() => navigate(`/products/edit/${product.id}`)}
                  >
                    <div className="h-10 w-10 bg-gray-200 rounded-md overflow-hidden mr-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Category: {product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">{product.quantity} left</p>
                      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No low stock products found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;