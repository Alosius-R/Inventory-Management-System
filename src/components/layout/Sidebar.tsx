import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ShoppingBag, Package, ClipboardList, BarChart2, Users, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  
  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Products', path: '/products', icon: <Package className="h-5 w-5" /> },
    { name: 'Orders', path: '/orders', icon: <ClipboardList className="h-5 w-5" /> },
    { name: 'Users', path: '/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  const userLinks = [
    { name: 'Shop', path: '/', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'My Orders', path: '/my-orders', icon: <ClipboardList className="h-5 w-5" /> },
  ];
  
  const links = isAdmin ? adminLinks : userLinks;
  
  const sidebarClasses = `transform top-0 left-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0 lg:static lg:h-auto`;
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="p-5 flex lg:hidden justify-end">
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-indigo-600 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="px-4 pt-6 lg:pt-16">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => 
                    `flex items-center py-3 px-4 rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;