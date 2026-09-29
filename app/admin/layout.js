'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Settings, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // If on login page, render without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
  ];

  const activeIndex = navLinks.findIndex(link => 
    link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
  );

  const handleMobileToggle = () => {
    if (isMobileMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }, 500);
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  const handleMobileNavigation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f4f9f8] text-gray-900 flex flex-col lg:flex-row antialiased overflow-x-hidden selection:bg-[#78a59b] selection:text-white">
      
      {/* Mobile Floating Glass Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 px-4 pointer-events-none">
        <header className="pointer-events-auto w-full bg-white/85 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgb(0,0,0,0.06)] rounded-[2rem] px-6 py-3.5 flex justify-between items-center transition-all duration-500 ease-out">
          <div>
            <h2 className="font-serif text-lg font-extrabold text-gray-900 tracking-tight leading-none">AQ Beauty</h2>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#4a7c73] mt-0.5">Admin Portal</p>
          </div>
          
          <button 
            onClick={handleMobileToggle}
            className="p-2.5 bg-white/70 hover:bg-white text-gray-900 rounded-full shadow-sm border border-white transition-all duration-300 active:scale-90 cursor-pointer"
          >
            {isMobileMenuOpen && !isClosing ? (
              <X className="w-5 h-5 rotate-90 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" strokeWidth={2.5} />
            ) : (
              <Menu className="w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" strokeWidth={2.5} />
            )}
          </button>
        </header>

        {/* Mobile Dropdown Bubble */}
        {isMobileMenuOpen && (
          <div className={`pointer-events-auto w-full mt-3 bg-white/95 backdrop-blur-2xl border border-white shadow-2xl rounded-[2rem] p-5 flex flex-col space-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isClosing 
              ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none' 
              : 'opacity-100 translate-y-0 scale-100'
          }`}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={handleMobileNavigation}
                  className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-100/60 flex justify-between px-2">
              <Link href="/admin/login" onClick={handleMobileNavigation} className="text-xs font-bold uppercase tracking-wider text-rose-500">Sign Out</Link>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Floating Glass Sidebar */}
      <aside className="hidden lg:flex w-72 fixed inset-y-0 left-0 p-6 flex-col z-40 pointer-events-none">
        <div className="pointer-events-auto flex-1 bg-white/70 backdrop-blur-2xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-6 flex flex-col relative overflow-hidden">
          
          {/* Logo */}
          <div className="mb-12 px-2">
            <h2 className="font-serif text-2xl font-extrabold text-gray-900 tracking-tight">AQ Beauty</h2>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#4a7c73] mt-1">
              Admin Portal
            </div>
          </div>

          {/* Nav Links with Black Sliding Pill Indicator */}
          <nav className="relative space-y-2.5 flex-1">
            {activeIndex !== -1 && (
              <div 
                className="absolute left-0 right-0 h-[52px] bg-black rounded-2xl shadow-md transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                style={{ transform: `translateY(${activeIndex * 60}px)` }}
              />
            )}

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
              
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`relative z-10 flex items-center space-x-3 px-4 h-[52px] rounded-2xl text-sm font-bold uppercase tracking-wider transition-colors duration-500 active:scale-[0.97] outline-none select-none ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-6 border-t border-white/60">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-gray-500 hover:bg-white/40 hover:text-gray-900 transition-colors duration-150 active:scale-[0.97] outline-none cursor-pointer">
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span>Settings</span>
            </button>
            <Link href="/admin/login" className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors duration-150 active:scale-[0.97] outline-none">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Sign Out</span>
            </Link>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-4 sm:p-6 pt-28 lg:pt-6 min-h-screen flex flex-col">
        <div className="flex-1 w-full bg-white/40 backdrop-blur-sm border border-white shadow-[0_10px_40px_rgba(0,0,0,0.02)] rounded-[2.5rem] p-6 sm:p-12">
          {children}
        </div>
      </main>

    </div>
  );
}