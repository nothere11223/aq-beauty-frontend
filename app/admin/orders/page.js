'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Clock, CheckCircle2, Truck, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(prev => 
          prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
        );
      } else {
        alert('Failed to update order status');
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
    <div className="space-y-8">
      
      {/* Back to Dashboard Button */}
      <Link 
        href="/admin" 
        className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors group cursor-pointer w-max"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4a7c73] mt-1">
            Real-time Storefront Fulfillments
          </p>
        </div>

        <button 
          onClick={fetchOrders}
          className="inline-flex items-center space-x-2 bg-white/80 border border-gray-200 hover:bg-white text-gray-700 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer w-max"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400 font-serif text-lg animate-pulse">
          Loading fulfillment queue...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-[2rem] border border-white p-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <h3 className="font-serif text-xl font-bold text-gray-700">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-400 mt-1">New customer transactions will populate here automatically.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-[2rem] p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono font-bold bg-black text-white px-3 py-1 rounded-full">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-lg font-bold text-gray-900">{order.customerName}</h4>
                  <p className="text-xs text-gray-500">{order.email} • {order.phone}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.address}, {order.city}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 overflow-x-auto max-w-full py-1">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-white/60 p-2 rounded-2xl border border-gray-100 flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="pr-2">
                      <p className="text-xs font-bold text-gray-800 line-clamp-1 max-w-[100px]">{item.name}</p>
                      <p className="text-[10px] text-gray-400">x{item.quantity} (${item.price?.toFixed(2)})</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 gap-4">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Total Revenue</span>
                  <span className="font-serif text-2xl font-extrabold text-gray-900">${order.totalAmount?.toFixed(2)}</span>
                </div>

                <select
                  disabled={updatingId === order._id}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 shadow-sm cursor-pointer disabled:opacity-50"
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