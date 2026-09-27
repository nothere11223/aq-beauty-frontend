'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { User, Mail, LogOut, Package, ShieldCheck, Loader2, Edit3, X } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  // Completely locked down session loader that ignores resize re-mounts
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const currentUserId = user?.userId || user?._id || user?.id;
    if (!currentUserId) {
      alert('Session error: User ID not found. Please log out and sign back in.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
      const uploadData = await uploadRes.json();

      const updateRes = await fetch(`${API_URL}/api/auth/update/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: uploadData.imageUrl })
      });
      if (!updateRes.ok) throw new Error('Database update failed');
      const updatedUser = await updateRes.json();

      setUser(updatedUser);
      localStorage.setItem('aq_user', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error(error);
      alert('Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
                  
                  {/* Avatar Container */}
                  <div 
                    className={`relative flex-shrink-0 ${user.image ? 'cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform duration-300' : ''}`} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (user.image) setIsFullscreen(true);
                    }}
                    title={user.image ? "Tap to view full photo" : ""}
                  >
                    <div className="w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-br from-[#e2f0ed] to-[#78a59b] rounded-full flex items-center justify-center text-white shadow-inner overflow-hidden border-4 border-white pointer-events-none">
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                      ) : user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif text-5xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-0">
                    <h2 className="font-serif text-3xl font-bold text-gray-900">{user.name}</h2>
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#4a7c73] mt-2 bg-[#4a7c73]/10 px-4 py-1.5 rounded-full">
                      <ShieldCheck className="w-4 h-4 mr-1.5" /> Verified Client
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current.click()}
                  className="group flex-shrink-0 whitespace-nowrap flex items-center justify-center space-x-2 bg-black text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-800 active:scale-[0.97] transition-all duration-300 shadow-xl hover:-translate-y-0.5 disabled:opacity-50 mt-4 sm:mt-0 cursor-pointer outline-none"
                >
                  <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
                </button>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
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

              <button onClick={handleLogout} className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] p-6 flex items-center justify-between hover:bg-rose-50 hover:border-rose-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer text-left outline-none">
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

      {/* FULLSCREEN IMAGE MODAL */}
      {isFullscreen && user?.image && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFullscreen(false);
          }}
        >
          <button 
            type="button"
            className="absolute top-8 right-8 text-white/70 hover:text-white transition-all duration-300 cursor-pointer outline-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFullscreen(false);
            }}
          >
            <X className="w-10 h-10 drop-shadow-lg" />
          </button>
          
          <img 
            src={user.image} 
            alt="Full size profile" 
            className="max-w-full max-h-[90vh] rounded-3xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        </div>
      )}
    </div>
  );
}