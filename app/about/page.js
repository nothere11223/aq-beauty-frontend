'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col antialiased">
      <Navbar />
      
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-8 pt-40 pb-24 text-center">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[3rem] p-10 sm:p-20">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#78a59b] mb-4 block">Our Philosophy</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">Pure Ingredients.<br/>Extraordinary Results.</h1>
          
          <div className="space-y-6 text-gray-600 leading-relaxed font-medium">
            <p>AQ Beauty was founded on a simple premise: luxury skincare shouldn't require compromising on clean, ethical ingredients. We believe in the power of nature, elevated by science.</p>
            <p>Every serum, cream, and formula is meticulously crafted to restore your skin's natural balance while delivering a premium, sensory experience.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}