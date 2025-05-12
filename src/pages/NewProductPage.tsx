import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/product/ProductForm';
import { Product } from '../types';
import productsData from '../data/products.json';

const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (product: Product) => {
    // In a real app, this would be an API call to create the product
    console.log('Creating new product:', product);
    
    // Simulate adding the product to the JSON data
    const updatedProducts = {
      products: [...productsData.products, product]
    };
    
    console.log('Updated products:', updatedProducts);
    
    // Redirect to products page after creation
    navigate('/products');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewProductPage;