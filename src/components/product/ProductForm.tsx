import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      category: '',
      image: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Default placeholder
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Handle numeric fields
    if (name === 'price' || name === 'quantity') {
      parsedValue = name === 'price' ? parseFloat(value) : parseInt(value, 10);
      
      // Don't set NaN values
      if (isNaN(parsedValue)) {
        parsedValue = 0;
      }
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.image?.trim()) {
      newErrors.image = 'Image URL is required';
    }
    
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.quantity === undefined || formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const now = new Date().toISOString();
    
    const completeProduct: Product = {
      id: initialData?.id || `p${uuidv4().substring(0, 8)}`,
      name: formData.name!,
      description: formData.description!,
      price: formData.price!,
      quantity: formData.quantity!,
      category: formData.category!,
      image: formData.image!,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };
    
    onSubmit(completeProduct);
  };
  
  const categories = [
    'Electronics',
    'Furniture',
    'Kitchen',
    'Clothing',
    'Health',
    'Fitness',
    'Books',
    'Toys',
    'Other',
  ];
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              error={errors.name}
              fullWidth
            />
            
            <Input
              label="Category"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Select category"
              error={errors.category}
              fullWidth
              list="categories-list"
            />
            <datalist id="categories-list">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            
            <Input
              label="Price ($)"
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price?.toString()}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.price}
              fullWidth
            />
            
            <Input
              label="Quantity"
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity?.toString()}
              onChange={handleChange}
              placeholder="0"
              error={errors.quantity}
              fullWidth
            />
            
            <div className="md:col-span-2">
              <Input
                label="Image URL"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                error={errors.image}
                fullWidth
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className={`shadow-sm ${
                  errors.description 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } p-2 block w-full rounded-md sm:text-sm`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
          
          {formData.image && (
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
              <div className="h-48 bg-gray-200 rounded-md overflow-hidden">
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/products')}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;