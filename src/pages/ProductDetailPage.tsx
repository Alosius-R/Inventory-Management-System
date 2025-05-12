import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, AlertCircle } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Product } from '../types';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProduct = productsData.products.find((p) => p.id === id);
      setProduct(foundProduct || null);
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
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button
          onClick={() => navigate('/products')}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= product.quantity) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    navigate('/cart');
  };
  
  const getStockLevel = (quantity: number) => {
    if (quantity <= 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };
  
  const stockLevel = getStockLevel(product.quantity);
  
  return (
    <div className="mb-8">
      <Button
        onClick={() => navigate('/products')}
        variant="outline"
        className="mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>
      
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80 md:h-auto bg-gray-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${stockLevel.color}`}>
                  {stockLevel.text}
                </span>
              </div>
              
              <p className="text-3xl font-bold text-indigo-700 mb-4">
                ${product.price.toFixed(2)}
              </p>
              
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="mt-auto">
                {product.quantity > 0 ? (
                  <>
                    <div className="flex items-center mb-6">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mr-4">
                        Quantity:
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        max={product.quantity}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="shadow-sm border-gray-300 p-2 block w-20 rounded-md sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-500">
                        {product.quantity} available
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleAddToCart}
                      fullWidth
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled
                    fullWidth
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Out of Stock
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;