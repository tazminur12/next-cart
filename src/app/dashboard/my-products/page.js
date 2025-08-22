'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function MyProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    totalStock: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (session || status === 'unauthenticated') fetchMyProducts();
  }, [session, status, router]);

  const fetchMyProducts = useCallback(async () => {
    try {
      setLoading(true);

      let productsData = [];
      let statsData = { total: 0, totalStock: 0 };

      if (session?.user?.email) {
        const resByEmail = await fetch(`/api/products/email?email=${encodeURIComponent(session.user.email)}`);
        if (resByEmail.ok) {
          const data = await resByEmail.json();
          productsData = data.products || [];
          statsData = { total: (data.stats?.total || 0), totalStock: (data.stats?.totalStock || 0) };
        }
      }

      if (!productsData || productsData.length === 0) {
        const res = await fetch('/api/products/my-products');
        if (res.ok) {
          const data = await res.json();
          productsData = data.products || [];
          statsData = { total: (data.stats?.total || 0), totalStock: (data.stats?.totalStock || 0) };
        }
      }

      setProducts(productsData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  const handleDeleteProduct = async (productId) => {
    try {
      const Swal = (await import('sweetalert2')).default;
      const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Delete Product?',
        text: 'This action cannot be undone. Are you sure you want to delete this product?',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280'
      });
      if (!confirm.isConfirmed) return;

      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete');

      setProducts(prev => prev.filter(p => p.id !== productId));
      Swal.fire({ 
        icon: 'success', 
        title: 'Product Deleted!', 
        text: 'The product has been removed from your store.',
        timer: 2000, 
        showConfirmButton: false,
        confirmButtonColor: '#10b981'
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      try {
        const Swal = (await import('sweetalert2')).default;
        Swal.fire({ 
          icon: 'error', 
          title: 'Delete Failed', 
          text: 'Failed to delete product. Please try again.',
          confirmButtonColor: '#ef4444'
        });
      } catch {}
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">My Products</h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">Please log in to manage your product listings</p>
            <Link
              href="/login"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-base sm:text-lg shadow-lg"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchMyProducts}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                My Products
              </h1>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">Manage your product listings and inventory</p>
            </div>
            <Link
              href="/dashboard/add-product"
              className="w-full lg:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Total Products</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />
                </svg>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalStock}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Total Stock</div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table/Cards */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Product Inventory
            </h2>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">Start building your store by adding your first product</p>
              <Link
                href="/dashboard/add-product"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Product
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="p-4 sm:p-6 space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <Image 
                            src={product.image} 
                            alt={product.title} 
                            width={80} 
                            height={80} 
                            className="w-20 h-20 rounded-lg object-cover shadow-md" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                          {product.brandName && (
                            <div className="text-xs text-blue-600 font-medium mb-2">Brand: {product.brandName}</div>
                          )}
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                              {product.category}
                            </span>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">${product.price}</div>
                              {product.discountPrice && (
                                <div className="text-xs text-green-600">Discounted: ${product.discountPrice}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                product.stockQuantity > 10 ? 'bg-green-500' : 
                                product.stockQuantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className={`text-xs font-medium ${
                                product.stockQuantity > 10 ? 'text-green-700' : 
                                product.stockQuantity > 0 ? 'text-yellow-700' : 'text-red-700'
                              }`}>
                                Stock: {product.stockQuantity}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Link 
                                href={`/dashboard/edit-product/${product.id}`} 
                                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </Link>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)} 
                                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-20 w-20">
                              <Image 
                                src={product.image} 
                                alt={product.title} 
                                width={80} 
                                height={80} 
                                className="h-20 w-20 rounded-xl object-cover shadow-md" 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 mb-1">{product.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs leading-relaxed">{product.description}</div>
                              {product.brandName && (
                                <div className="text-xs text-blue-600 font-medium mt-1">Brand: {product.brandName}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">${product.price}</div>
                          {product.discountPrice && (
                            <div className="text-xs text-green-600">Discounted: ${product.discountPrice}</div>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              product.stockQuantity > 10 ? 'bg-green-500' : 
                              product.stockQuantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`text-sm font-medium ${
                              product.stockQuantity > 10 ? 'text-green-700' : 
                              product.stockQuantity > 0 ? 'text-yellow-700' : 'text-red-700'
                            }`}>
                              {product.stockQuantity}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium space-x-3">
                          <Link 
                            href={`/dashboard/edit-product/${product.id}`} 
                            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 border border-blue-500/20"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Product
                          </Link>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)} 
                            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 border border-red-500/20"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
