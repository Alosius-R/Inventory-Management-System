import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ShoppingBag, Check } from 'lucide-react';
import Card, { CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CartItemCard from '../components/cart/CartItemCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import ordersData from '../data/orders.json';
import { v4 as uuidv4 } from 'uuid';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { getCartWithProducts, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  
  const cartItems = getCartWithProducts();
  const [shippingAddress, setShippingAddress] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const handleProceedToCheckout = () => {
    setCheckoutStep('checkout');
  };
  
  const handlePlaceOrder = () => {
    // Create order object
    const newOrder = {
      id: `o${uuidv4().substring(0, 8)}`,
      userId: user?.id || '',
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      })),
      status: 'pending',
      totalAmount: getTotalPrice(),
      shippingAddress: shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, we would make an API call here
    console.log('Order created:', newOrder);
    
    // Add order to existing orders
    const updatedOrders = {
      orders: [...ordersData.orders, newOrder]
    };
    
    // In a real app, we would save this data to a database
    console.log('Updated orders:', updatedOrders);
    
    // Simulate order creation
    setTimeout(() => {
      clearCart();
      setOrderPlaced(true);
      setCheckoutStep('confirmation');
    }, 1000);
  };
  
  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-green-100 p-4 mb-6">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Thank you for your order. We've received your request and will process it shortly.
        </p>
        <Button
          onClick={() => navigate('/my-orders')}
        >
          View My Orders
        </Button>
      </div>
    );
  }
  
  if (cartItems.length === 0 && checkoutStep === 'cart') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-gray-100 p-4 mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Button
          onClick={() => navigate('/products')}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Continue Shopping
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      {checkoutStep === 'cart' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent>
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.productId}
                      item={item}
                      product={item.product}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-indigo-700">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    fullWidth
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
      
      {checkoutStep === 'checkout' && (
        <>
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setCheckoutStep('cart')}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      id="fullName"
                      placeholder="Enter your full name"
                      value={user?.name || ''}
                      readOnly
                      fullWidth
                    />
                    
                    <Input
                      label="Email"
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={user?.email || ''}
                      readOnly
                      fullWidth
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shippingAddress">
                        Shipping Address
                      </label>
                      <textarea
                        id="shippingAddress"
                        rows={3}
                        className="shadow-sm border-gray-300 p-2 block w-full rounded-md sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your shipping address"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                    <div className="p-4 border rounded-md bg-gray-50">
                      <p className="text-gray-700">In this demo, payment is simulated. No actual payment will be processed.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-gray-200 mt-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-bold text-indigo-700">${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={!shippingAddress}
                  >
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;