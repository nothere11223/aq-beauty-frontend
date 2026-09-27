'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  // Fallback safely if id or _id is present
  const productId = product?._id || product?.id;

  return (
    <Link href={`/product/${productId}`} className="block h-full">
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-5 shadow-sm border border-white flex flex-col relative group hover:shadow-xl hover:bg-white/90 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full">
        
        {/* Wishlist Button */}
        <button 
          className="absolute top-6 right-6 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 z-10 transition-all shadow-sm active:scale-90" 
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Product Image */}
        <div className="aspect-square bg-gray-50 rounded-[2rem] overflow-hidden mb-5 border border-gray-100 relative">
          <img 
            src={product?.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000'} 
            alt={product?.name || 'Product'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-grow justify-between px-1">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#4a7c73]">
              {product?.category || 'Signature Collection'}
            </span>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-1 line-clamp-1">
              {product?.name || 'Luxury Formulation'}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100/60">
            <span className="font-serif text-lg font-bold text-gray-900">
              ${product?.price?.toFixed(2) ?? '0.00'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
              View →
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}