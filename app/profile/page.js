'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { User, Mail, LogOut, Package, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback to your real backend, NOT localhost
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-2pvjv418.b4a.run';

  useEffect(() => {
    const loadSession = () => {
      try {
        const savedUser = localStorage.getItem('aq_user');
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Failed to parse user session', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aq_user');
    localStorage.removeItem('token'); 
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-gray-500 font-serif text-xl animate-pulse">Loading profile...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col antialiased relative">
      <Navbar />

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-8 pt-36 pb-24">
        <div className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#78a59b] mb-2 block">Client Portal</span>
          <h1 className="font-serif text-4xl font-bold text-gray-900">My Account</h1>
        </div>

        {!user ? (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[3rem] p-12 text-center max-w-md mx-auto">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-bold mb-2">Not Signed In</h2>
            <p className="text-sm text-gray-500 mb-6">Access your personal details and order history by signing in.</p>
            <Link href="/login" className="inline-block bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
              Sign In
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                  
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-br from-[#e2f0ed] to-[#78a59b] rounded-full flex items-center justify-center text-white shadow-inner overflow-hidden border-4 border-white">
                      <span className="font-serif text-5xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-0">
                    <h2 className="font-serif text-3xl font-bold text-gray-900">{user.name}</h2>
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#4a7c73] mt-2 bg-[#4a7c73]/10 px-4 py-1.5 rounded-full">
                      <ShieldCheck className="w-4 h-4 mr-1.5" /> Verified Client
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 flex-shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Registered Email</p>
                    <p className="text-base font-medium text-gray-900 mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 flex-shrink-0 shadow-sm">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Account ID</p>
                    <p className="text-base font-mono text-gray-900 mt-0.5">{user.userId || user.id || user._id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link href="/track-order" className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] p-6 flex items-center justify-between hover:bg-white/90 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#78a59b]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-5 h-5 text-[#4a7c73]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-base text-gray-900">Order History</h3>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mt-0.5">Track your packages</p>
                  </div>
                </div>
              </Link>

              <button type="button" onClick={handleLogout} className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] p-6 flex items-center justify-between hover:bg-rose-50 hover:border-rose-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer text-left outline-none">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-100/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <LogOut className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-rose-600">Sign Out</h3>
                    <p className="text-xs uppercase tracking-widest text-rose-400/80 mt-0.5">End your session</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}