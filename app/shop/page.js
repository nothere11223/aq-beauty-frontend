'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProductGrid from '../../components/ProductGrid';
import Footer from '../../components/Footer';

function ShopContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts(1);
  }, [searchQuery]);

  const fetchProducts = async (page) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}&limit=12`);
      const data = await res.json();
      
      let fetchedProducts = Array.isArray(data) ? data : (data.products || []);
      
      if (searchQuery) {
        fetchedProducts = fetchedProducts.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setProducts(fetchedProducts);
      setTotalPages(Array.isArray(data) ? 1 : (data.totalPages || 1));
      setCurrentPage(Array.isArray(data) ? 1 : (data.currentPage || 1));
    } catch (err) {
      console.error('Error fetching shop products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 pb-24 md:pb-0 flex flex-col antialiased">
      <Navbar />
      
      <main className="flex-grow w-full max-w-[92%] xl:max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-16">
        <div className="mb-12">
          <Link href="/" className="inline-block text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-4 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-2">
            {searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4a7c73]">
            Complete AQ Beauty Collection
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-28 animate-pulse">
            <p className="text-gray-500 font-serif text-xl tracking-wide">Loading catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-12 text-center border border-white text-gray-600">
            <p className="font-serif text-lg mb-1">No products found.</p>
          </div>
        ) : (
          <div>
            <ProductGrid products={products} />
            
            {totalPages > 1 && !searchQuery && (
              <div className="flex justify-center items-center space-x-3 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      fetchProducts(pageNumber);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-11 h-11 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                      currentPage === pageNumber
                        ? 'bg-black text-white shadow-lg scale-105'
                        : 'bg-white/70 backdrop-blur-md border border-white text-gray-700 hover:bg-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0f7f5] flex items-center justify-center"><p className="animate-pulse">Loading...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}