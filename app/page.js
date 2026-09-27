'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

const categories = [
  { name: 'All', img: '/categories/all.jpg', slug: 'all' },
  { name: 'Skincare', img: '/categories/skincare.jpg', slug: 'skincare' },
  { name: 'Makeup', img: '/categories/makeup.jpg', slug: 'makeup' },
  { name: 'Haircare', img: '/categories/haircare.jpg', slug: 'haircare' },
  { name: 'Fragrance', img: '/categories/fragrance.jpg', slug: 'fragrance' },
  { name: 'Bath & Body', img: '/categories/bath-body.jpg', slug: 'bath-body' },
  { name: 'Beauty Tools', img: '/categories/tools.jpg', slug: 'beauty-tools' }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('all'); 
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const savedTab = sessionStorage.getItem('aq_active_tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchProducts(1, activeTab);
    }
  }, [activeTab, isInitialized]);

  const fetchProducts = async (page = 1, tab = 'all') => {
    setIsLoading(true);
    try {
      const sortParam = tab !== 'all' ? `&sort=${tab}` : '';
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'; // Added environment variable
      
      const response = await fetch(`${API_URL}/api/products?page=${page}&limit=8${sortParam}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    sessionStorage.setItem('aq_active_tab', tabId); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 pb-24 md:pb-0 flex flex-col antialiased">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes iosSpring {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-ios-spring { 
          animation: iosSpring 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
      `}} />

      <Navbar />
      
      <main className="flex-grow w-full max-w-[92%] xl:max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-16 space-y-16">
        
        <div className="bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] rounded-[2.5rem] p-6 sm:p-12 lg:p-16 transition-all duration-500">
          <Hero />
        </div>

        {/* 🔥 UPDATED CATEGORY SECTION 🔥 */}
        <div>
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="font-serif text-2xl font-bold text-gray-900">Explore Categories</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.name}
                href={cat.slug === 'all' ? '/shop' : `/shop/category/${cat.slug}`}
                className="cursor-pointer group relative rounded-[2rem] overflow-hidden shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] active:scale-95 hover:shadow-xl aspect-square block"
              >
                {/* Full Card Background Image */}
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                />
                
                {/* Dark Gradient Overlay (Restricted to bottom third only) */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* White Text Overlay Pinned tightly to the bottom */}
                <span className="absolute bottom-2 sm:bottom-3 inset-x-0 z-10 font-serif text-sm sm:text-base lg:text-lg font-bold text-white tracking-wide drop-shadow-md text-center px-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 px-2">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#78a59b]">Curated Line</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mt-1">Signature Collection</h2>
            </div>

            <div className="relative flex items-center bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-white/80 shadow-sm w-full sm:w-[380px]">
              <div 
                className="absolute top-1.5 bottom-1.5 w-[calc((100%-12px)/3)] bg-black rounded-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-md"
                style={{
                  transform: 
                    activeTab === 'all' ? 'translateX(0)' : 
                    activeTab === 'best-sellers' ? 'translateX(100%)' : 
                    'translateX(200%)'
                }}
              ></div>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'best-sellers', label: 'Best-Sellers' },
                { id: 'sale', label: 'On Sale' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative z-10 flex-1 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-500 cursor-pointer ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="min-h-[400px]"> 
            {isLoading ? (
              <div className="flex justify-center items-center py-28 animate-pulse">
                <p className="text-gray-500 font-serif text-xl tracking-wide">Curating luxury collection...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-20 text-rose-600 bg-rose-50/80 backdrop-blur-md rounded-3xl border border-rose-100 max-w-xl mx-auto">
                <p className="text-sm font-medium">Oops! We couldn't load the products: {error}</p>
              </div>
            ) : products.length === 0 ? (
              <div key="empty" className="animate-ios-spring bg-white/80 backdrop-blur-md rounded-[2.5rem] p-12 text-center border border-white text-gray-600">
                <p className="font-serif text-lg mb-1">No products found matching your criteria.</p>
              </div>
            ) : (
              <div key={`${activeTab}-${currentPage}`} className="animate-ios-spring">
                <ProductGrid products={products} />
                
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-3 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => {
                          setCurrentPage(pageNumber);
                          fetchProducts(pageNumber, activeTab);
                        }}
                        className={`w-11 h-11 rounded-full text-xs font-bold tracking-wider transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-90 ${
                          currentPage === pageNumber
                            ? 'bg-black text-white shadow-lg scale-110'
                            : 'bg-white/80 backdrop-blur-md border border-white text-gray-700 hover:bg-white hover:scale-105'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}