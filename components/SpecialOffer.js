'use client';

import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';

export default function SpecialOffer() {
  return (
    <div className="w-full bg-white/90 backdrop-blur-2xl border border-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
      
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center space-x-2 bg-[#f0f7f5] px-4 py-1.5 rounded-full border border-[#d1e7e2] shadow-sm">
          <Tag className="w-3.5 h-3.5 text-[#4a7c73]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">Limited Time</span>
        </div>
        
        <h3 className="font-serif text-3xl sm:text-4xl font-medium text-black tracking-tight">
          Special Offer — Up to <span className="italic text-[#4a7c73]">30% Off</span>
        </h3>
        
        <p className="text-gray-600 text-sm max-w-lg font-medium">
          Elevate your daily ritual with our handpicked seasonal skincare bundles. Pure ingredients, extraordinary results.
        </p>
      </div>

      <Link 
        href="/shop?category=offers"
        className="group flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex-shrink-0"
      >
        <span>Grab Now</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>

    </div>
  );
}