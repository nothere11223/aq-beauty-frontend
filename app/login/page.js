'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isRegistering ? `${API_URL}/api/auth/register` : `${API_URL}/api/auth/login`;
    const payload = isRegistering ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || (isRegistering ? 'Registration failed' : 'Login failed'));
      }

      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('aq_user', JSON.stringify(data.user));

      router.push('/profile');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Google authentication failed');
      }

      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('aq_user', JSON.stringify(data.user));

      router.push('/profile');
    } catch (err) {
      console.error(err);
      setError('Google login failed to reach server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] flex flex-col justify-between antialiased">
        <Navbar />

        <div className="flex-grow flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 pb-32">
          
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-black text-white rounded-xl mb-2 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 font-serif tracking-tight">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-[#4a7c73] mt-0.5 font-bold">
              Client Portal Access
            </p>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md w-full px-2">
            <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[2.5rem] py-7 px-6 sm:px-8">
              
              {error && (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 px-3 py-2.5 rounded-xl text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div className="flex justify-center mb-5">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Authentication Failed')}
                  theme="outline"
                  size="large"
                  shape="pill"
                />
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#f9fbfb] text-gray-400 font-bold uppercase tracking-widest rounded-full border border-gray-100 text-[10px]">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form className="space-y-3.5" onSubmit={handleSubmit}>
                {isRegistering && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3.5 py-2.5 bg-white/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900"
                        placeholder="Jane Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3.5 py-2.5 bg-white/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3.5 py-2.5 bg-white/50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-md text-xs font-bold uppercase tracking-[0.15em] text-white bg-black hover:bg-gray-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
                  </button>
                </div>
              </form>

              <div className="mt-5 text-center border-t border-gray-100/80 pt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                  className="text-[11px] text-gray-500 hover:text-black font-bold uppercase tracking-widest transition-colors cursor-pointer block w-full"
                >
                  {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>

                <Link 
                  href="/shop" 
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                >
                  <span>&larr;</span>
                  <span>Back to Shop</span>
                </Link>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}