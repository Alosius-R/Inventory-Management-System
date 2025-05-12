import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NewProductPage from './pages/NewProductPage';
import EditProductPage from './pages/EditProductPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Route guard for protected routes
const PrivateRoute: React.FC<{ 
  element: React.ReactNode;
  adminOnly?: boolean;
}> = ({ element, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{element}</>;
};

const AppRoutes: React.FC = () => {
  const { isAdmin } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Admin Routes */}
      <Route 
        path="/dashboard" 
        element={<PrivateRoute element={<DashboardPage />} adminOnly />}
      />
      <Route 
        path="/products/new" 
        element={<PrivateRoute element={<NewProductPage />} adminOnly />}
      />
      <Route 
        path="/products/edit/:id" 
        element={<PrivateRoute element={<EditProductPage />} adminOnly />}
      />
      
      {/* User Routes */}
      <Route 
        path="/" 
        element={<PrivateRoute element={<ProductsPage />} />}
      />
      <Route 
        path="/products" 
        element={<PrivateRoute element={<ProductsPage />} />}
      />
      <Route 
        path="/products/:id" 
        element={<PrivateRoute element={<ProductDetailPage />} />}
      />
      <Route 
        path="/cart" 
        element={<PrivateRoute element={<CartPage />} />}
      />
      <Route 
        path="/my-orders" 
        element={<PrivateRoute element={<OrdersPage />} />}
      />
      <Route 
        path="/my-orders/:id" 
        element={<PrivateRoute element={<OrderDetailPage />} />}
      />
      
      {/* Admin Order Management */}
      <Route 
        path="/orders" 
        element={<PrivateRoute element={<OrdersPage />} adminOnly />}
      />
      <Route 
        path="/orders/:id" 
        element={<PrivateRoute element={<OrderDetailPage />} adminOnly />}
      />
      
      {/* Redirect to Dashboard or Products page based on role */}
      <Route 
        path="*" 
        element={<Navigate to={isAdmin ? "/dashboard" : "/"} />}
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;