'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        throw new Error(data.error || data.message || 'Admin authentication failed');
      }

      const tokenToSave = data.token || data.adminToken || data.accessToken;

      if (tokenToSave) {
        // Reverted to match original token format
        localStorage.setItem('aq_admin_token', tokenToSave);
        router.push('/admin');
      } else {
        throw new Error('Server response succeeded but did not return a valid token.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid admin credentials or server error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] flex flex-col items-center justify-start pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-11 h-11 bg-black text-white rounded-2xl mb-2.5 shadow-md">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900">Admin Portal</h2>
      </div>

      <div className="w-full max-w-md px-2">
        <div className="bg-white/90 backdrop-blur-2xl border border-white/90 py-6 px-6 sm:px-8 shadow-xl rounded-[2.5rem]">
          
          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2.5 rounded-2xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleAdminLogin}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Admin Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50/60 border border-gray-200/80 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900"
                  placeholder="admin@aqbeauty.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50/60 border border-gray-200/80 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-lg text-[11px] font-bold uppercase tracking-[0.15em] text-white bg-black hover:bg-gray-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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