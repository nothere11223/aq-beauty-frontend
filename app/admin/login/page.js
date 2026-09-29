'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Admin authentication failed');
      }

      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      }

      router.push('/admin');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid admin credentials or server error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <div className="mb-6 flex justify-center">
          <Link 
            href="/shop" 
            className="inline-flex items-center space-x-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm transition-all"
          >
            <span>&larr;</span>
            <span>Back to Shop</span>
          </Link>
        </div>

        <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-2xl mb-3 shadow-md">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl font-extrabold text-gray-900">Admin Portal</h2>
        <p className="text-xs uppercase tracking-widest text-[#4a7c73] mt-1 font-bold">Secure Management Access</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-2xl border border-white py-8 px-6 shadow-xl rounded-[2.5rem] sm:px-10">
          
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAdminLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">Admin Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900"
                  placeholder="admin@aqbeauty.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-xs font-bold uppercase tracking-[0.15em] text-white bg-black hover:bg-gray-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}