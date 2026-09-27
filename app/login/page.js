'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Loader2, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Authentication failed');
      }

      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('aq_user', JSON.stringify(data.user));

      router.push('/shop');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Failed to connect to backend server. Check CORS or API URL.');
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
        throw new Error(data.error || data.message || 'Google authentication failed');
      }

      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('aq_user', JSON.stringify(data.user));

      router.push('/shop');
    } catch (err) {
      console.error('Google Auth error:', err);
      setError(err.message || 'Failed to connect to backend server via Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col antialiased">
        <Navbar />

        <main className="flex-grow w-full max-w-md mx-auto px-4 pt-36 pb-24 flex flex-col justify-center">
          
          <Link href="/shop" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8 group cursor-pointer w-max">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Shop</span>
          </Link>

          <div className="bg-white/85 backdrop-blur-3xl border border-white rounded-[3rem] p-8 sm:p-10 shadow-2xl">
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                {isLogin ? 'Sign in to access your client portal' : 'Join AQ Beauty for exclusive access'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 text-rose-500 text-sm font-medium rounded-2xl border border-rose-100 text-center">
                {error}
              </div>
            )}

            {/* GOOGLE SIGN-IN BUTTON */}
            <div className="flex justify-center mb-6 w-full overflow-hidden rounded-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Authentication Failed')}
                theme="outline"
                size="large"
                shape="pill"
                width="100%"
              />
            </div>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Or continue with email
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* EMAIL FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="name" 
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/60 border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 transition-all" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/60 border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 transition-all" 
                    placeholder="jane@example.com" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="password" 
                    name="password" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/60 border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 transition-all" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center space-x-2 bg-black text-white px-8 py-4.5 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl mt-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }} 
                  className="ml-2 font-bold text-[#4a7c73] hover:text-black transition-colors outline-none cursor-pointer"
                >
                  {isLogin ? 'Register now' : 'Sign in'}
                </button>
              </p>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}