'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative w-full bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 transition-all duration-500">
      
      {/* Left Text Content */}
      <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
        <div className="inline-flex items-center space-x-2 bg-[#f0f7f5] px-4 py-2 rounded-full border border-[#d1e7e2] shadow-sm">
          <Sparkles className="w-4 h-4 text-[#4a7c73]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">New Arrivals</span>
        </div>
        
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium text-black leading-[1.1] tracking-tight">
          Glow Naturally, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-800 italic pr-2">
            Shine Beautifully.
          </span>
        </h1>
        
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
          Explore our premium beauty collection crafted for radiant elegance and timeless grace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start pt-2">
          <Link 
            href="/shop"
            className="group flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-300 ease-out shadow-lg w-full sm:w-auto"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
          </Link>
        </div>
      </div>

      {/* Right Image Composition - Fully responsive for mobile and desktop */}
      <div className="flex-1 relative w-full max-w-sm sm:max-w-md lg:max-w-none aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[450px] flex items-center justify-center">
        {/* Soft ice-blue aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#78a59b]/20 to-[#a3c9c2]/30 blur-2xl rounded-full scale-90 -z-10"></div>
        
        <img 
          src="https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000&auto=format&fit=crop" 
          alt="Luxury Skincare" 
          className="w-full h-full object-cover rounded-[2rem] sm:rounded-[3rem] shadow-xl border-4 border-white"
        />
      </div>

    </div>
  );
}