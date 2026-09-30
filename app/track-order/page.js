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

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-8 pt-32 pb-20">
        
        <div className="mb-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#78a59b] mb-1.5 block">Client Dashboard</span>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Your Order History</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-gray-500 animate-pulse font-serif text-lg">Loading your orders...</div>
        ) : !user ? (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[2.5rem] p-8 sm:p-10 text-center max-w-md mx-auto">
            <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" strokeWidth={1.5} />
            <h2 className="font-serif text-xl font-bold mb-1.5">Authentication Required</h2>
            <p className="text-[11px] text-gray-500 mb-5">Please sign in to view your live order status and tracking details.</p>
            <Link href="/login" className="inline-block bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
              Sign In Now
            </Link>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 shadow-xl rounded-[2.5rem] p-8 sm:p-10 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h2 className="font-serif text-xl font-bold mb-1.5">Failed to Load Orders</h2>
            <p className="text-[11px] text-gray-700 font-mono bg-white p-2.5 rounded-lg border border-rose-100 break-words mb-5">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all cursor-pointer">
              Retry Connection
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl rounded-[2.5rem] p-8 sm:p-10 text-center max-w-md mx-auto">
            <Package className="w-10 h-10 text-gray-400 mx-auto mb-3" strokeWidth={1.5} />
            <h2 className="font-serif text-xl font-bold mb-1.5">No Orders Found</h2>
            <p className="text-[11px] text-gray-500 mb-5">You haven't placed any secure orders with us yet, {user.name}.</p>
            <Link href="/shop" className="inline-block bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-mono font-bold bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">ID: {order._id.slice(-6).toUpperCase()}</span>
                    <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#78a59b] bg-[#78a59b]/10 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1" /> {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto max-w-full py-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="w-10 h-10 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 relative group">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <div className="text-right w-full md:w-auto flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Total Paid</span>
                  <span className="font-serif text-lg font-bold text-gray-900">Rs. {order.totalAmount.toLocaleString()}</span>
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