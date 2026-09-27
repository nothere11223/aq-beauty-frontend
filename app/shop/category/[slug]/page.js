'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import ProductGrid from '../../../../components/ProductGrid';
import Footer from '../../../../components/Footer';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug; 
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategoryProducts(1);
  }, [categorySlug]);

  const fetchCategoryProducts = async (page) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/products?category=${categorySlug}&page=${page}&limit=8`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (err) {
      console.error('Error fetching category products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedTitle = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 pb-24 md:pb-0 flex flex-col antialiased">
      <Navbar />
      
      <main className="flex-grow w-full max-w-[92%] xl:max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-16">
        
        <div className="mb-12">
          <Link href="/" className="inline-block text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-4 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-2">
            {formattedTitle} Collection
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4a7c73]">
            Curated Professional Grade Products
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-28 animate-pulse">
            <p className="text-gray-500 font-serif text-xl tracking-wide">Loading {formattedTitle}...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-12 text-center border border-white text-gray-600">
            <p className="font-serif text-lg mb-1">No products found in {formattedTitle}.</p>
          </div>
        ) : (
          <div>
            <ProductGrid products={products} />
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      fetchCategoryProducts(pageNumber);
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