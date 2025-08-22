'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    stockQuantity: '',
    description: '',
    brandName: '',
    sku: '',
    discountPrice: '',
    tags: '',
    imageUrl: ''
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Food & Beverages',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Health & Beauty',
    'Automotive',
    'Toys & Games',
    'Jewelry & Accessories',
    'Pet Supplies',
    'Office & School',
    'Baby & Kids',
    'Tools & Hardware',
    'Other'
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'loading') return; // Still loading
    
  
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (session) {
      
    }
  }, [session, status, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imageUrl') {
      const url = value.trim();
      setFormData(prev => ({ ...prev, imageUrl: url }));
      // Simple preview if looks like a URL
      if (url.startsWith('http://') || url.startsWith('https://')) {
        setImagePreview(url);
      } else {
        setImagePreview(null);
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, tags: value }));
  };

  const addTag = () => {
    const newTag = formData.tags.trim();
    if (newTag && !formData.tags.split(',').map(t => t.trim()).includes(newTag)) {
      const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      const updatedTags = [...currentTags, newTag].join(', ');
      setFormData(prev => ({ ...prev, tags: updatedTags }));
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t !== tagToRemove);
    setFormData(prev => ({ ...prev, tags: currentTags.join(', ') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic URL validation
      if (!formData.imageUrl || !/^https?:\/\//i.test(formData.imageUrl)) {
        throw new Error('Please provide a valid image URL (http/https)');
      }

      // Prepare product data
      const productData = {
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        description: formData.description,
        brandName: formData.brandName || undefined,
        sku: formData.sku || undefined,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        image: formData.imageUrl.trim(),
        creatorEmail: session?.user?.email || undefined
      };

      // Create product using API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        const message = result?.error || 'Failed to create product';
        try {
          const Swal = (await import('sweetalert2')).default;
          await Swal.fire({ 
            icon: 'error', 
            title: 'Error', 
            text: message,
            confirmButtonColor: '#ef4444',
            timer: 3000
          });
        } catch {
          alert(`Error: ${message}`);
        }
        return;
      }
      
      try {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({ 
          icon: 'success', 
          title: 'Product Added Successfully! 🎉', 
          text: 'Your product has been created and is now available in your store.',
          confirmButtonColor: '#10b981',
          timer: 4000,
          showConfirmButton: true,
          confirmButtonText: 'View My Products'
        });
      } catch {
        // fallback
      }
      
      // Redirect to My Products page
      router.replace('/dashboard/my-products');
      
    } catch (error) {
      console.error('Error creating product:', error);
      try {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: error.message || 'Something went wrong',
          confirmButtonColor: '#ef4444',
          timer: 3000
        });
      } catch {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.title && formData.category && formData.price && formData.stockQuantity && formData.description && formData.imageUrl;
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to add products to your store</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Create a new product listing for your store</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Logged in as: {session?.user?.email}</span>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="ml-2 text-sm font-medium text-gray-700">Product Details</span>
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span className="ml-2 text-sm font-medium text-gray-500">Image & Tags</span>
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span className="ml-2 text-sm font-medium text-gray-500">Review & Submit</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Core Required Fields Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                1
              </div>
              <span>Core Product Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter product name"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Name */}
              <div>
                <label htmlFor="brandName" className="block text-sm font-semibold text-gray-700 mb-3">
                  Brand Name
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter brand name"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-3">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Discount Price */}
              <div>
                <label htmlFor="discountPrice" className="block text-sm font-semibold text-gray-700 mb-3">
                  Discount Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
                  <input
                    type="number"
                    id="discountPrice"
                    name="discountPrice"
                    step="0.01"
                    min="0"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Stock Quantity */}
              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-semibold text-gray-700 mb-3">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  required
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter stock quantity"
                />
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="block text-sm font-semibold text-gray-700 mb-3">
                  SKU / Product Code
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter SKU or product code"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Provide detailed description of the product..."
                />
              </div>
            </div>
          </div>

          {/* Product Image URL Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                2
              </div>
              <span>Product Image & Media</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-3">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  required
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="https://images.example.com/your-image.jpg"
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Paste a direct image link (PNG/JPG/WebP). Ensure the URL is publicly accessible.
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Image Preview</label>
                  <div className="relative w-40 h-40 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                3
              </div>
              <span>Additional Information & SEO</span>
            </h2>
            
            <div className="space-y-6">
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-3">
                  Tags / Keywords
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleTagInput}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter tags separated by commas"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg"
                  >
                    Add Tag
                  </button>
                </div>
                
                {/* Display Tags */}
                {formData.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => {
                      const trimmedTag = tag.trim();
                      if (trimmedTag) {
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 shadow-sm"
                          >
                            {trimmedTag}
                            <button
                              type="button"
                              onClick={() => removeTag(trimmedTag)}
                              className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Add relevant keywords for better search visibility and SEO
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Required fields</span> are marked with <span className="text-red-500">*</span>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/my-products')}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center min-w-[160px] shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
