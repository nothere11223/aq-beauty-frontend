'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full max-w-[92%] xl:max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pb-10">
      <div className="bg-white/60 backdrop-blur-2xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-[3rem] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        
        {/* Brand info */}
        <div className="space-y-3">
          <Link href="/" className="font-serif text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            AQ Beauty Hub
          </Link>
          <p className="text-xs text-gray-500 font-medium max-w-sm">
            Crafted for radiant elegance. Premium formulations designed to nourish your natural glow.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#4a7c73]">Navigation</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors">Home</Link>
              <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors">Shop</Link>
              <Link href="/shop?category=skincare" className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors">Skincare</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#4a7c73]">Admin</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/admin/login" className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors">Portal Login</Link>
              <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center pt-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          © {new Date().getFullYear()} AQ Beauty Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}