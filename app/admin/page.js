'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    lowStockItems: []
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const adminToken = localStorage.getItem('aq_admin_token');
      
      if (!adminToken) {
        throw new Error('Admin token missing. You are not logged in as an administrator.');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      };

      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/orders?t=${new Date().getTime()}`, { headers }),
        fetch(`${API_URL}/api/products?limit=100&t=${new Date().getTime()}`, { headers })
      ]);

      if (!ordersRes.ok) {
        const errorText = await ordersRes.text();
        throw new Error(`Backend rejected orders request (Status: ${ordersRes.status}). Message: ${errorText}`);
      }
      if (!productsRes.ok) {
        const errorText = await productsRes.text();
        throw new Error(`Backend rejected products request (Status: ${productsRes.status}). Message: ${errorText}`);
      }

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.orders || []);
      const products = Array.isArray(productsData) ? productsData : (productsData.products || []);

      const active = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Delivered');
      const totalRevenue = orders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      const lowStock = products.filter(p => p.stock < 10);

      setStats({
        revenue: totalRevenue,
        activeOrders: active.length,
        totalProducts: products.length,
        lowStockItems: lowStock
      });
      setAuthError(null);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="relative transition-all duration-700 ease-out opacity-100 translate-y-0 pb-16">
      
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">
          Dashboard Overview
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Business Analytics & Alerts
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-7 h-7 text-[#78a59b] animate-spin" />
        </div>
      ) : authError ? (
        <div className="bg-rose-50 border border-rose-200 rounded-[2rem] p-6 text-center max-w-xl mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-xs text-gray-600 mb-5 font-mono bg-white p-3 rounded-xl border border-rose-100 break-words">{authError}</p>
          <Link href="/admin/login" className="inline-block bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-md">
            Log in to Admin Portal
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[2rem] p-5">
              <div className="w-10 h-10 bg-[#e2f0ed] text-[#4a7c73] rounded-full flex items-center justify-center border border-[#d1e7e2] mb-3">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Total Revenue</h3>
              <p className="font-serif text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[2rem] p-5">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 mb-3">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Active Orders</h3>
              <p className="font-serif text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[2rem] p-5">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center border border-purple-100 mb-3">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Catalog Size</h3>
              <p className="font-serif text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[2rem] p-6">
              <div className="flex items-center space-x-2.5 mb-4">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <h2 className="font-serif text-lg font-bold text-gray-900">Low Stock Alerts</h2>
              </div>
              
              {stats.lowStockItems.length === 0 ? (
                <div className="py-6 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Inventory levels are healthy.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {stats.lowStockItems.map(item => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-[9px] uppercase tracking-widest text-rose-500 font-bold">Only {item.stock} left</p>
                        </div>
                      </div>
                      <Link href="/admin/inventory" className="text-[11px] font-bold text-gray-900 hover:text-[#4a7c73]">
                        Restock
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[2rem] p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-gray-900 mb-1">Management Portal</h2>
                <p className="text-xs text-gray-500 mb-4">Quickly navigate storefront controls.</p>
              </div>
              
              <div className="space-y-3">
                <Link href="/admin/orders" className="group flex items-center justify-between p-4 bg-white/50 hover:bg-white border border-white rounded-xl shadow-sm transition-all">
                  <div className="flex items-center space-x-2.5 text-gray-900">
                    <ShoppingBag className="w-4 h-4 text-[#4a7c73]" />
                    <span className="text-xs font-bold tracking-wide">Process Orders</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#4a7c73] group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/admin/products" className="group flex items-center justify-between p-4 bg-white/50 hover:bg-white border border-white rounded-xl shadow-sm transition-all">
                  <div className="flex items-center space-x-2.5 text-gray-900">
                    <Package className="w-4 h-4 text-[#4a7c73]" />
                    <span className="text-xs font-bold tracking-wide">Product Catalog</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#4a7c73] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}