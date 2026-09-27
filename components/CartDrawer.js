'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const cartTotal = cart?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  const cartCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    setIsCartOpen(false);

    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('aq_user');
    
    if (!savedUser) {
      // If not logged in, redirect to login page
      router.push('/login');
    } else {
      // If logged in, proceed straight to checkout
      router.push('/checkout');
    }
  };

  return (
    <>
      {/* 1. Smooth Dark Glass Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-[60] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* 2. Floating Rounded Glass Bubble Drawer */}
      <div 
        className={`fixed top-4 bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[420px] bg-white/90 backdrop-blur-3xl shadow-[-15px_15px_40px_rgba(0,0,0,0.08)] border border-white/80 z-[70] flex flex-col rounded-[2.5rem] overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-[120%]'
        }`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100/50 bg-white/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
              <ShoppingBag className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 tracking-tight leading-none">Your Bag</h2>
              <p className="text-[10px] uppercase tracking-widest text-[#78a59b] font-bold mt-1">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-3 bg-white hover:bg-gray-50 text-gray-500 hover:text-black rounded-full shadow-sm border border-gray-100 transition-all duration-300 active:scale-90 cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Cart Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-5 opacity-80">
              <div className="p-6 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                <ShoppingBag className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-serif text-xl text-gray-700 font-medium">Your bag is empty.</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">Discover our luxury collections and find your new favorites.</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-2 bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Explore Shop
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={item._id || item.id || `cart-item-${index}`} 
                className="flex gap-4 items-center bg-white/60 p-3.5 rounded-[1.5rem] border border-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-shadow duration-300"
              >
                
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 py-1">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">${item.price?.toFixed(2)}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 mt-3 bg-white border border-gray-100/80 w-max rounded-full px-2 py-1 shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                      className="text-gray-400 hover:text-black active:scale-90 transition-all p-1 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" strokeWidth={3} />
                    </button>
                    <span className="text-xs font-bold w-5 text-center text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                      className="text-gray-400 hover:text-black active:scale-90 transition-all p-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item._id || item.id)}
                  className="p-2.5 mr-1 text-gray-300 bg-white border border-transparent rounded-full hover:border-rose-100 hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart?.length > 0 && (
          <div className="p-6 bg-white/80 border-t border-gray-100/50 space-y-5 rounded-b-[2.5rem]">
            <div className="flex justify-between items-end text-gray-900 px-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
              <span className="font-serif text-2xl font-bold leading-none">${cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              className="group w-full flex items-center justify-center space-x-2 bg-black text-white px-8 py-4.5 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>Secure Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
            </button>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-2">
              Shipping calculated at next step
            </p>
          </div>
        )}
      </div>
    </>
  );
}