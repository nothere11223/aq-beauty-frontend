'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [authError, setAuthError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const adminToken = localStorage.getItem('aq_admin_token');
      
      if (!adminToken) {
        throw new Error('Admin token missing. You are not logged in as an administrator.');
      }

      const res = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend rejected request (Status: ${res.status}). Message: ${errorText}`);
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const adminToken = localStorage.getItem('aq_admin_token');
      
      if (!adminToken) {
        alert('Admin session expired. Please log in again.');
        return;
      }

      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(prev => 
          prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
        );
      } else {
        const errorText = await res.text();
        alert(`Failed to update order status: ${errorText}`);
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      <Link 
        href="/admin" 
        className="inline-flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm group cursor-pointer w-max"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a7c73] mt-0.5">
            Real-time Storefront Fulfillments
          </p>
        </div>

        <button 
          onClick={fetchOrders}
          className="inline-flex items-center space-x-2 bg-white/80 border border-gray-200 hover:bg-white text-gray-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer w-max"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400 font-serif text-base animate-pulse">
          Loading fulfillment queue...
        </div>
      ) : authError ? (
        <div className="bg-rose-50 border border-rose-200 rounded-[2rem] p-6 text-center max-w-xl mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-xs text-gray-600 mb-4 font-mono bg-white p-3 rounded-xl border border-rose-100 break-words">{authError}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-[2rem] border border-white p-6">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
          <h3 className="font-serif text-lg font-bold text-gray-700">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-400 mt-0.5">Customer transactions will populate here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_6px_20px_rgba(0,0,0,0.02)] rounded-[2rem] p-5 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-black text-white px-2.5 py-0.5 rounded-full">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-gray-900">{order.customerName}</h4>
                  <p className="text-[11px] text-gray-500">{order.email} • {order.phone}</p>
                  <p className="text-[11px] text-gray-400">{order.address}, {order.city}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto max-w-full py-1">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-white/60 p-1.5 rounded-xl border border-gray-100 flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="pr-1">
                      <p className="text-[11px] font-bold text-gray-800 line-clamp-1 max-w-[90px]">{item.name}</p>
                      <p className="text-[9px] text-gray-400">x{item.quantity} (${item.price?.toFixed(2)})</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 gap-3">
                <div className="text-left lg:text-right">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">Total</span>
                  <span className="font-serif text-xl font-extrabold text-gray-900">${order.totalAmount?.toFixed(2)}</span>
                </div>

                <select
                  disabled={updatingId === order._id}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-800 focus:outline-none shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}