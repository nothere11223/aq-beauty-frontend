'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('aq_admin_token', data.token);
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex justify-center items-center p-4 overflow-hidden bg-[#f0f7f5] antialiased">
      
      {/* Apple-Style Ambient Background Blurs (Matches your brand colors) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#78a59b]/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#d1e7e2]/40 blur-[150px]"></div>

      {/* Main Glass Container - iOS Entrance Animation */}
      <div 
        className={`relative z-10 w-full max-w-[28rem] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
      >
        <div className="bg-white/60 backdrop-blur-[40px] border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[3rem] p-10 sm:p-14">
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-white/80 backdrop-blur-xl border border-white rounded-[1.5rem] shadow-sm flex items-center justify-center mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <ShieldCheck className="w-10 h-10 text-[#4a7c73]" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#78a59b] mt-3">AQ Beauty Hub</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-rose-50/80 backdrop-blur-md border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 ml-2 block mb-2">Admin Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl pl-12 pr-5 py-4 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#78a59b]/30 transition-all duration-300 shadow-sm group-hover:shadow-md" 
                  placeholder="admin@aqbeauty.com" 
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#78a59b]" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 ml-2 block mb-2">Master Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  name="password" 
                  required 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl pl-12 pr-5 py-4 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#78a59b]/30 transition-all duration-300 shadow-sm group-hover:shadow-md" 
                  placeholder="••••••••" 
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#78a59b]" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full group mt-8 flex items-center justify-center space-x-2 bg-black text-white px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-900 active:scale-[0.96] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 shadow-[0_8px_20px_rgba(0,0,0,0.1)] cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Authenticate</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}