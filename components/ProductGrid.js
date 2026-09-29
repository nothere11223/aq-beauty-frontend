'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductGrid({ products }) {
  const { addToCart } = useCart();

  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
      {products.map((product) => (
        <div 
          key={product._id}
          className="group relative bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[1.25rem] sm:rounded-[2.5rem] p-2.5 sm:p-4 flex flex-col hover:bg-white/95 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* Image Container */}
          <Link href={`/product/${product._id}`} className="block relative aspect-square sm:aspect-[4/5] w-full rounded-xl sm:rounded-[2rem] overflow-hidden bg-[#f4f9f8] mb-3 sm:mb-5 border border-white/50">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000'} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            
            {/* Category Badge */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#4a7c73] shadow-sm border border-white/50">
              {product.category || 'Luxury'}
            </div>

            {/* Sale Badge */}
            {product.isSale && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-rose-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest shadow-sm">
                Sale
              </div>
            )}
          </Link>

          {/* Product Details */}
          <div className="flex flex-col flex-grow px-1 sm:px-2">
            <Link href={`/product/${product._id}`}>
              <h3 className="font-serif text-sm sm:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#4a7c73] transition-colors duration-300">
                {product.name}
              </h3>
            </Link>
            <p className="hidden sm:block text-xs text-gray-500 mt-1 line-clamp-2 mb-4 flex-grow font-medium">
              {product.description || 'Premium formulation for radiant results.'}
            </p>
            
            {/* Price & Add to Cart Button */}
            <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-gray-100/60">
              <div className="flex flex-col">
                {product.isSale && product.salePrice ? (
                  <>
                    <span className="font-serif text-sm sm:text-xl font-bold text-rose-500">
                      Rs. {product.salePrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                      Rs. {product.price?.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-base sm:text-xl font-bold text-gray-900">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                )}
              </div>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="flex items-center justify-center bg-black text-white h-8 w-8 sm:h-11 sm:w-11 rounded-full hover:bg-gray-800 hover:scale-110 active:scale-90 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-md group/btn cursor-pointer"
                aria-label="Add to bag"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}