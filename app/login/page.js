'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  const handleSimpleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('aq_user', JSON.stringify(data.user));

      router.push('/shop');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/shop" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Shop</Link>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Sign In (Simple Test)</h1>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Testing mobile stability without Google SDK or complex styles.</p>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSimpleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          style={{ background: 'black', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}