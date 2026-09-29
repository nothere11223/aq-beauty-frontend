'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, Sparkles } from 'lucide-react';

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

      router.push('/profile'); // Redirect directly to profile upon success
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

      router.push('/profile'); // Redirect directly to profile upon success
    } catch (err) {
      console.error(err);
      setError('Google login failed to reach server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
          <div className="mb-6 flex justify-center">
            <Link 
              href="/shop" 
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-white text-gray-800 hover:bg-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm transition-all active:scale-95"
            >
              <span>&larr;</span>
              <span>Back to Shop</span>
            </Link>
          </div>
          
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-2xl mb-4 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 font-serif tracking-tight">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#4a7c73] mt-2 font-bold">
            Client Portal Access
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[3rem] py-10 px-6 sm:px-10">
            
            {error && (
              <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            {/* Google Login is now available for BOTH Sign In and Sign Up */}
            <div className="flex justify-center mb-6 w-full overflow-hidden rounded-xl border border-gray-200/50">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Authentication Failed')}
                theme="outline"
                size="large"
                shape="rectangular"
                width="100%"
              />
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#f9fbfb] text-gray-400 font-bold uppercase tracking-widest rounded-full border border-gray-100">
                  Or continue with email
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900 transition-all"
                    placeholder="you@example.com"
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
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 text-gray-900 transition-all"
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
                  {isLoading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-xs text-gray-500 hover:text-black font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}