import React from 'react';
import { Trash, Plus, Minus } from 'lucide-react';
import { CartItem, Product } from '../../types';
import Button from '../ui/Button';

interface CartItemCardProps {
  item: CartItem;
  product: Product;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  product,
  updateQuantity,
  removeFromCart,
}) => {
  const handleIncrement = () => {
    if (item.quantity < product.quantity) {
      updateQuantity(product.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(product.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-medium text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
          {product.description}
        </p>
        <p className="font-bold text-indigo-700 mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center border rounded-md">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className={`p-1 ${
              item.quantity <= 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="px-2 w-10 text-center">{item.quantity}</span>
          
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= product.quantity}
            className={`p-1 ${
              item.quantity >= product.quantity
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <p className="font-semibold text-gray-800">
          ${(product.price * item.quantity).toFixed(2)}
        </p>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => removeFromCart(product.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
        >
          <Trash className="w-4 h-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItemCard;