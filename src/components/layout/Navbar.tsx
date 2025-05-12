import React from 'react';
import { ShoppingCart, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <h1 
                className="text-xl font-bold text-indigo-600 cursor-pointer"
                onClick={() => navigate('/')}
              >
                InventoryPro
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              <div className="rounded-full bg-indigo-100 p-1 text-indigo-600">
                <User className="h-5 w-5" />
              </div>
            </div>
            
            <button
              onClick={() => logout()}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;