import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ProductGrid from '../components/product/ProductGrid';
import { Product } from '../types';
import productsData from '../data/products.json';
import { useAuth } from '../context/AuthContext';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Load products
  useEffect(() => {
    setProducts(productsData.products);
    setFilteredProducts(productsData.products);
  }, []);
  
  // Filter products based on search term and category
  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);
  
  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  ).sort();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Manage Products' : 'Shop Products'}
        </h1>
        
        {isAdmin && (
          <Button
            onClick={() => navigate('/products/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search products..."
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="shadow-sm border-gray-300 pl-10 block w-full rounded-md sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <ProductGrid
        products={filteredProducts}
        emptyMessage={
          searchTerm || selectedCategory
            ? 'No products match your search criteria'
            : 'No products available'
        }
      />
    </div>
  );
};

export default ProductsPage;