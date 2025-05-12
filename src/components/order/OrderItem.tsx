import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Package, Clock, XCircle } from 'lucide-react';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Order } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface OrderItemProps {
  order: Order;
  products: Record<string, { name: string; image: string }>;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, products }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
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
  
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
            <p className="text-sm text-gray-500">Placed on {formattedDate}</p>
          </div>
          
          <div className="flex items-center mt-2 md:mt-0">
            {getStatusIcon(order.status)}
            <span className="ml-2 font-medium text-gray-800">
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.productId} className="flex items-center">
              <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                {products[item.productId] && (
                  <img
                    src={products[item.productId].image}
                    alt={products[item.productId].name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              
              <div className="ml-4 flex-grow">
                <h4 className="font-medium text-gray-800 line-clamp-1">
                  {products[item.productId]?.name || 'Product not found'}
                </h4>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
          
          {order.items.length > 2 && (
            <p className="text-sm text-gray-500">
              +{order.items.length - 2} more item(s)
            </p>
          )}
          
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <p className="text-gray-500">Total</p>
            <p className="font-bold text-lg text-indigo-700">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 flex justify-end">
        <Button
          variant="outline"
          onClick={() => 
            navigate(isAdmin ? `/orders/${order.id}` : `/my-orders/${order.id}`)
          }
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderItem;