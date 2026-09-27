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
      console.error('Session load error:', e);
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
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/shop" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Shop</Link>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>My Account (Simple Test)</h1>

      {!user ? (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <p>You are not signed in.</p>
          <Link href="/login" style={{ display: 'inline-block', marginTop: '10px', background: 'black', color: 'white', padding: '10px 20px', borderRadius: '4px' }}>
            Sign In
          </Link>
        </div>
      ) : (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p style={{ marginBottom: '20px' }}><strong>ID:</strong> {user.userId || user.id || user._id}</p>

          <button 
            type="button" 
            onClick={handleLogout}
            style={{ background: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}