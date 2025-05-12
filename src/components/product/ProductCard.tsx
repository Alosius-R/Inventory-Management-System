import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  
  const getStockLevel = (quantity: number) => {
    if (quantity <= 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };
  
  const stockLevel = getStockLevel(product.quantity);
  
  return (
    <Card className="h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative pt-[75%] bg-gray-200 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${stockLevel.color}`}>
          {stockLevel.text}
        </span>
      </div>
      
      <CardContent className="flex-grow">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
        <p className="font-bold text-lg text-indigo-700">${product.price.toFixed(2)}</p>
      </CardContent>
      
      <CardFooter className="bg-white pt-0">
        {isAdmin ? (
          <Button 
            variant="outline" 
            onClick={() => navigate(`/products/edit/${product.id}`)}
            fullWidth
          >
            Edit Product
          </Button>
        ) : (
          <div className="flex space-x-2 w-full">
            <Button 
              onClick={() => navigate(`/products/${product.id}`)}
              variant="outline"
              className="flex-1"
            >
              Details
            </Button>
            {product.quantity <= 0 ? (
              <Button 
                disabled
                variant="primary"
                className="flex-1"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                Unavailable
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  addToCart(product.id, 1);
                  navigate('/cart');
                }}
                variant="primary"
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;