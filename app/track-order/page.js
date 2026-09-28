'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Package, Clock, ShieldAlert, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  useEffect(() => {
    const savedUser = localStorage.getItem('aq_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Robust ID extraction mapping different payload structures
        const userId = parsedUser.userId || parsedUser._id || parsedUser.id;
        
        if (!userId) {
          throw new Error("Corrupted session: User ID is missing.");
        }
        
        fetchUserOrders(userId);
      } catch (err) {
        console.error("Session parse error", err);
        setError("Failed to read user session. Please log out and back in.");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/orders/my-orders/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error (${res.status}): ${errorText}`);
      }
      
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-8 pt-36 pb-24">
        
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#78a59b] mb-2 block">Client Dashboard</span>
          <h1 className="font-serif text-4xl font-bold text-gray-900">Your Order History</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse font-serif text-xl">Loading your orders...</div>
        ) : !user ? (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[3rem] p-12 text-center max-w-md mx-auto">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-xs text-gray-500 mb-6">Please sign in to view your live order status and tracking details.</p>
            <Link href="/login" className="inline-block bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
              Sign In Now
            </Link>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 shadow-xl rounded-[3rem] p-12 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-2">Failed to Load Orders</h2>
            <p className="text-xs text-gray-700 font-mono bg-white p-3 rounded-lg border border-rose-100 break-words mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all cursor-pointer">
              Retry Connection
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[3rem] p-12 text-center max-w-lg mx-auto">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-bold mb-2">No Orders Found</h2>
            <p className="text-xs text-gray-500 mb-6">You haven't placed any secure orders with us yet, {user.name}.</p>
            <Link href="/shop" className="inline-block bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-600">ID: {order._id.slice(-6).toUpperCase()}</span>
                    <span className="flex items-center text-xs font-bold uppercase tracking-wider text-[#78a59b] bg-[#78a59b]/10 px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 mr-1" /> {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center space-x-3 overflow-x-auto max-w-full py-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 relative group">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <div className="text-right w-full md:w-auto flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Paid</span>
                  <span className="font-serif text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}