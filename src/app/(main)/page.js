'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const slides = [
  {
    title: 'Discover Amazing Products',
    subtitle: 'Fresh arrivals every week with exclusive collections',
    highlight: 'New Collections',
    bg: 'from-pink-100 via-rose-100 to-orange-100',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    cta: 'Shop Now',
    ctaSecondary: 'Learn More'
  },
  {
    title: 'Unbeatable Deals & Offers',
    subtitle: 'Top deals you cannot miss with massive discounts',
    highlight: 'Best Prices',
    bg: 'from-blue-100 via-indigo-100 to-cyan-100',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    cta: 'View Deals',
    ctaSecondary: 'About Us'
  },
  {
    title: 'Lightning Fast Delivery',
    subtitle: 'Express shipping across the country with tracking',
    highlight: 'Express Shipping',
    bg: 'from-emerald-100 via-teal-100 to-green-100',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    cta: 'Shop Now',
    ctaSecondary: 'Contact Us'
  },
];

function buildApiUrl(path, params = {}) {
  const origin = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = new URL(path.startsWith('/') ? path : `/${path}`, origin);
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v)); });
  return url.toString();
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingFeatured(true);
        const url = buildApiUrl('/api/products', { page: 1, limit: 4 });
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        setFeatured(Array.isArray(data.products) ? data.products.slice(0, 4) : []);
      } catch (e) {
        setFeatured([]);
      } finally {
        setLoadingFeatured(false);
      }
    };
    load();
  }, []);

  const current = slides[index];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Enhanced Large Hero Slider */}
      <div className="relative overflow-hidden">
        <div className={`bg-gradient-to-br ${current.bg} min-h-[80vh] lg:min-h-[90vh] flex items-center`}>
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src={current.image} 
              alt={current.title}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                  <span className="text-sm font-medium text-gray-800">{current.highlight}</span>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {current.title}
                </h1>
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl lg:max-w-none">
                  {current.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    href="/products" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    {current.cta}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link 
                    href="/about" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white rounded-xl text-base font-medium hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border border-white/50 dark:border-gray-700/50"
                  >
                    {current.ctaSecondary}
                  </Link>
                </div>
              </div>
              
              {/* Visual Element */}
              <div className="hidden lg:block relative">
                <div className="relative w-full h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-6 scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-3xl transform -rotate-6 scale-95"></div>
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-white/50 dark:border-gray-700/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">Premium Quality</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Curated for you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Product Highlights */}
      <div className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Featured Products
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Product Highlights</h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Discover our carefully curated selection of premium products that customers love</p>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Products Yet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check back soon for amazing products!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-40 bg-gray-50 dark:bg-gray-700 overflow-hidden">
                      <Image 
                        src={p.image} 
                        alt={p.title} 
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">Featured</span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{p.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${p.price}</span>
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium">{p.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link 
                  href="/products" 
                  className="inline-flex items-center px-6 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  View All Products
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Why Choose Us
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose NextCart?</h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We provide the best shopping experience with quality products and excellent service that exceeds expectations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Quality Products</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Carefully curated selection of high-quality products from trusted brands and verified sellers.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Best Prices</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Competitive pricing and regular deals to help you save money on every purchase with price match guarantee.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Fast Delivery</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Quick and reliable shipping with real-time tracking to get your products to you as soon as possible.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-base text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">Join thousands of satisfied customers who trust NextCart for their shopping needs. Experience the difference today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-xl text-base font-medium hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              View All Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white border-2 border-white/50 rounded-xl text-base font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
