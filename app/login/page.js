'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

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
        throw new Error(data.error || (isRegistering ? 'Registration failed' : 'Login failed'));
      }

      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('aq_user', JSON.stringify(data.user));

      router.push('/shop');
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

      router.push('/shop');
    } catch (err) {
      console.error(err);
      setError('Google login failed to reach server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          {/* Converted Back to Shop text into a clean button */}
          <div className="mb-6">
            <Link 
              href="/shop" 
              className="inline-flex items-center space-x-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm transition-all"
            >
              <span>&larr;</span>
              <span>Back to Shop</span>
            </Link>
          </div>
          
          <h2 className="text-center text-3xl font-extrabold text-gray-900 font-serif">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            {!isRegistering && (
              <>
                {/* GOOGLE LOGIN BUTTON */}
                <div className="flex justify-center mb-6 w-full overflow-hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Authentication Failed')}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    width="100%"
                  />
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 text-xs uppercase tracking-wider">Or email</span>
                  </div>
                </div>
              </>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {isRegistering && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Sign In')}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-xs text-gray-600 hover:text-black font-medium underline uppercase tracking-wider"
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