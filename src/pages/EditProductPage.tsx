import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/product/ProductForm';
import { Product } from '../types';
import productsData from '../data/products.json';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to get the product
    setTimeout(() => {
      const foundProduct = productsData.products.find((p) => p.id === id);
      setProduct(foundProduct || null);
      setIsLoading(false);
    }, 300);
  }, [id]);
  
  const handleSubmit = (updatedProduct: Product) => {
    // In a real app, this would be an API call to update the product
    console.log('Updating product:', updatedProduct);
    
    // Simulate updating the product in the JSON data
    const updatedProducts = {
      products: productsData.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    };
    
    console.log('Updated products:', updatedProducts);
    
    // Redirect to products page after update
    navigate('/products');
  };
  
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
        <p className="text-gray-600 mb-6">The product you're trying to edit doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProductPage;