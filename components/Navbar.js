'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, User, LogOut, Package, Settings, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

export default function Navbar() {
  const cartContext = useCart(); 
  const cart = cartContext?.cart || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const router = useRouter();

  // TEMPORARY DEBUG TRAP: Catch what is deleting the session
  useEffect(() => {
    const originalRemove = localStorage.removeItem;
    localStorage.removeItem = function(key) {
      if (key === 'token' || key === 'aq_user') {
        console.error(`🚨 ALERT: Something just deleted ${key}! See stack trace below:`);
        console.trace(); // This prints the EXACT file and line number that called removeItem
      }
      originalRemove.apply(this, arguments);
    };
    return () => { localStorage.removeItem = originalRemove; }; // Cleanup
  }, []);

  // Stable session loader that will not wipe state on mobile re-renders
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('aq_user');
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    };
    
    loadUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aq_user');
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    router.push('/login');
  };

  const handleOpenCart = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    if (typeof cartContext?.setIsCartOpen === 'function') cartContext.setIsCartOpen(true);
    else if (typeof cartContext?.setIsOpen === 'function') cartContext.setIsOpen(true);
    else if (typeof cartContext?.toggleCart === 'function') cartContext.toggleCart();
  };

  const handleToggle = () => {
    setIsSearchOpen(false);
    setShowDropdown(false);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchToggle = () => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
    setIsSearchOpen(!isSearchOpen);
  };

  const handleNavigation = (href) => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    router.push(href);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isOpen = isMobileMenuOpen || isSearchOpen;

  return (
    <>
      <div 
        onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(false); }}
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-md transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-3 px-4 pointer-events-none">
        <div className="relative w-full max-w-6xl pointer-events-auto">
          
          <header className="w-full bg-white/85 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgb(0,0,0,0.06)] rounded-[2.5rem] px-6 sm:px-9 py-3.5 flex justify-between items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            
            <div className="flex items-center space-x-4 sm:space-x-0">
              <button 
                onClick={handleToggle}
                className="md:hidden p-3 text-gray-900 hover:bg-gray-100/80 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 shadow-sm cursor-pointer outline-none relative w-11 h-11 flex items-center justify-center"
              >
                <Menu className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'opacity-0 scale-50 -rotate-90' : 'opacity-100 scale-100 rotate-0'}`} strokeWidth={2.5} />
                <X className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`} strokeWidth={2.5} />
              </button>

              <Link href="/" className="font-serif text-2xl sm:text-3xl font-extrabold text-black tracking-tight hover:opacity-70 active:scale-95 transition-all duration-300 ease-out ml-1">
                AQ Beauty
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              <Link href="/" className="text-xs font-bold uppercase tracking-[0.15em] text-gray-800 hover:text-black">Home</Link>
              <Link href="/shop" className="text-xs font-bold uppercase tracking-[0.15em] text-gray-800 hover:text-black">Shop All</Link>
              <Link href="/track-order" className="text-xs font-bold uppercase tracking-[0.15em] text-gray-800 hover:text-black">Track Order</Link>
              <Link href="/support" className="text-xs font-bold uppercase tracking-[0.15em] text-gray-800 hover:text-black">Support</Link>
            </nav>

            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSearchToggle}
                className="p-3 bg-white/70 hover:bg-white text-black rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white cursor-pointer"
              >
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>

              <button 
                onClick={handleOpenCart}
                className="relative p-3 bg-white/70 hover:bg-white text-black rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#78a59b] text-white text-[10px] font-extrabold h-[22px] w-[22px] flex items-center justify-center rounded-full shadow-sm border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative p-1 bg-white/70 hover:bg-white text-black rounded-full shadow-sm border border-white cursor-pointer outline-none ml-1"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e2f0ed] to-[#78a59b] flex items-center justify-center text-white shadow-inner overflow-hidden border border-white">
                      {user?.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-3xl border border-white shadow-2xl rounded-[2rem] p-3">
                      <div className="p-5 border-b border-gray-100/80 bg-gray-50/50 rounded-3xl mb-2 text-center">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#e2f0ed] to-[#78a59b] flex items-center justify-center text-white overflow-hidden border-2 border-white">
                          {user?.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-serif text-xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <h3 className="font-serif text-lg font-bold text-gray-900 line-clamp-1">{user.name}</h3>
                          <ShieldCheck className="w-4 h-4 text-[#4a7c73]" />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 line-clamp-1">{user.email}</p>
                      </div>

                      <div className="space-y-1 p-1">
                        <Link href="/profile" onClick={() => setShowDropdown(false)} className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl hover:bg-gray-50 text-gray-600">
                          <Settings className="w-4 h-4 text-[#78a59b]" />
                          <span className="text-xs font-bold uppercase tracking-wider">Client Portal</span>
                        </Link>
                        <Link href="/track-order" onClick={() => setShowDropdown(false)} className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl hover:bg-gray-50 text-gray-600">
                          <Package className="w-4 h-4 text-[#78a59b]" />
                          <span className="text-xs font-bold uppercase tracking-wider">Order History</span>
                        </Link>
                      </div>

                      <div className="mt-1 p-1 border-t border-gray-100">
                        <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl hover:bg-rose-50 text-rose-500 cursor-pointer outline-none">
                          <LogOut className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="hidden md:flex items-center px-5 py-3 bg-white/70 hover:bg-white text-black rounded-full shadow-sm border border-white text-xs font-bold uppercase tracking-wider ml-1"
                >
                  Sign In
                </Link>
              )}
            </div>
          </header>

          {/* Smooth Search Dropdown */}
          <div className={`absolute left-0 right-0 top-[calc(100%+1rem)] bg-white/95 backdrop-blur-3xl border border-white/80 shadow-2xl rounded-[2.5rem] p-4 sm:p-5 transition-all duration-700 ${isSearchOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95 pointer-events-none'}`}>
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <input 
                type="text"
                placeholder="Search luxury skincare, serums, makeup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-gray-900 focus:outline-none px-2 py-2"
              />
              <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer">
                Search
              </button>
            </form>
          </div>

          {/* Smooth Mobile Menu */}
          <div className={`absolute left-0 right-0 top-[calc(100%+1rem)] md:hidden bg-white/95 backdrop-blur-3xl border border-white/80 shadow-2xl rounded-[2.5rem] p-6 flex flex-col space-y-2 transition-all duration-700 ${isMobileMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95 pointer-events-none'}`}>
            <button onClick={() => handleNavigation('/')} className="text-left text-xs font-bold uppercase tracking-widest text-gray-900 py-3 px-5 rounded-2xl hover:bg-gray-100/50">Home</button>
            <button onClick={() => handleNavigation('/shop')} className="text-left text-xs font-bold uppercase tracking-widest text-gray-900 py-3 px-5 rounded-2xl hover:bg-gray-100/50">Shop All</button>
            <button onClick={() => handleNavigation('/track-order')} className="text-left text-xs font-bold uppercase tracking-widest text-gray-900 py-3 px-5 rounded-2xl hover:bg-gray-100/50">Track Order</button>
            <button onClick={() => handleNavigation('/support')} className="text-left text-xs font-bold uppercase tracking-widest text-gray-900 py-3 px-5 rounded-2xl hover:bg-gray-100/50">Support</button>
            
            {user ? (
              <div className="pt-3 mt-1 border-t border-gray-100/80 flex flex-col space-y-2.5">
                <button onClick={() => handleNavigation('/profile')} className="w-full flex items-center justify-center space-x-2 bg-[#f0f7f5] text-[#4a7c73] py-3.5 px-5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#d1e7e2]">
                  <Settings className="w-4 h-4" />
                  <span>Client Portal</span>
                </button>
                <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-rose-50 text-rose-600 py-3.5 px-5 rounded-full text-xs font-bold uppercase tracking-widest border border-rose-100">
                  <LogOut className="w-4 h-4" />
                  <span>Secure Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-1 border-t border-gray-100/80">
                <button onClick={() => handleNavigation('/login')} className="w-full bg-black text-white py-3.5 px-5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                  Sign In / Register
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}