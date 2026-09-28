'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileNav() {
  const pathname = usePathname();
  
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const cartContext = useCart();
  const cartCount = cartContext?.cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const isCartOpen = cartContext?.isCartOpen || cartContext?.isOpen || false;

  const closeCartIfOpen = () => {
    if (typeof cartContext?.setIsCartOpen === 'function') {
      cartContext.setIsCartOpen(false);
    } else if (typeof cartContext?.setIsOpen === 'function') {
      cartContext.setIsOpen(false);
    }
  };

  const handleOpenCart = (e) => {
    e.preventDefault();
    if (typeof cartContext?.toggleCart === 'function') {
      cartContext.toggleCart();
    } else if (typeof cartContext?.setIsCartOpen === 'function') {
      cartContext.setIsCartOpen(prev => !prev);
    } else if (typeof cartContext?.setIsOpen === 'function') {
      cartContext.setIsOpen(prev => !prev);
    }
  };

  // Determine active tab index instantly
  let activeIndex = 0;
  if (isCartOpen) {
    activeIndex = 2; 
  } else if (pathname.startsWith('/profile')) {
    activeIndex = 4;
  } else if (pathname.startsWith('/track-order')) {
    activeIndex = 3;
  } else if (pathname.startsWith('/shop')) {
    activeIndex = 1;
  } else {
    activeIndex = 0;
  }

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-[100] pointer-events-auto px-4 flex justify-center">
      
      <div className="relative w-full max-w-[24rem] bg-white/85 backdrop-blur-3xl border border-white/90 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.12)] rounded-[2.5rem]">
        
        {/* Optimized Snappy Sliding Background Pill (Duration shortened to 300ms to eliminate visual lag) */}
        <div className="absolute top-1.5 bottom-1.5 left-1.5 right-1.5 pointer-events-none">
          <div 
            className="w-[20%] h-full bg-black rounded-[2rem] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        </div>

        {/* Navigation Grid */}
        <div className="relative z-10 grid grid-cols-5 w-full">
          
          <Link href="/" onClick={closeCartIfOpen} className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group">
            <Home className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 0 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 0 ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 0 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Home</span>
          </Link>

          <Link href="/shop" onClick={closeCartIfOpen} className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group">
            <LayoutGrid className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 1 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 1 ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 1 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Shop</span>
          </Link>

          <button type="button" onClick={handleOpenCart} className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group outline-none">
            <div className="relative">
              <ShoppingBag className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 2 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 2 ? 2.5 : 2} />
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 h-[18px] w-[18px] flex items-center justify-center rounded-full text-[9px] font-extrabold shadow-sm transition-colors duration-300 ${activeIndex === 2 ? 'bg-white text-black border-2 border-black' : 'bg-[#78a59b] text-white border-2 border-white'}`}>
                  {cartCount}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 2 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Cart</span>
          </button>

          <Link href="/track-order" onClick={closeCartIfOpen} className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group">
            <Package className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 3 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 3 ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 3 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Orders</span>
          </Link>

          <Link href="/profile" onClick={closeCartIfOpen} className="flex flex-col items-center justify-center py-2.5 cursor-pointer active:scale-95 transition-transform group">
            <User className={`h-5 w-5 mb-1 transition-colors duration-300 ${activeIndex === 4 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={activeIndex === 4 ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeIndex === 4 ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>Profile</span>
          </Link>

        </div>
      </div>
    </div>
  );
}