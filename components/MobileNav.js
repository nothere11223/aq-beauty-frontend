'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Package, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  let activeIndex = 0;
  if (pathname.startsWith('/profile') || pathname.startsWith('/login')) {
    activeIndex = 3;
  } else if (pathname.startsWith('/track-order') || pathname.startsWith('/orders')) {
    activeIndex = 2;
  } else if (pathname.startsWith('/shop')) {
    activeIndex = 1;
  } else {
    activeIndex = 0; 
  }

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-[100] pointer-events-auto px-4 flex justify-center">
      <div className="relative w-full max-w-[22rem] bg-white/85 backdrop-blur-3xl border border-white/90 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.12)] rounded-[2.5rem]">
        
        <div className="absolute top-1.5 bottom-1.5 left-1.5 right-1.5 pointer-events-none">
          <div 
            className="w-[25%] h-full bg-black rounded-[2rem] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-4 w-full">
          <Link href="/" className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group">
            <Home className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 0 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 0 ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 0 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Home</span>
          </Link>

          <Link href="/shop" className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group">
            <LayoutGrid className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 1 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 1 ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 1 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Shop</span>
          </Link>

          <Link href="/track-order" className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group">
            <Package className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 2 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 2 ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 2 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Orders</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group">
            <User className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 3 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 3 ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 3 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}