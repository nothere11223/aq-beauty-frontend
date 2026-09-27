'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aq_user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Session error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aq_user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isLoading) {
    return <div className="p-12 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="mb-6">
          <Link href="/shop" className="text-sm font-bold text-blue-600 hover:underline">
            &larr; Back to Shop
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        {!user ? (
          <div>
            <p className="text-gray-600 mb-4">You are not logged in.</p>
            <Link href="/login" className="block text-center bg-black text-white py-2 px-4 rounded-md font-medium">
              Sign In
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Name</p>
              <p className="text-lg font-medium text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}