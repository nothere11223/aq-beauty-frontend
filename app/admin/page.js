'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    lowStockItems: []
  });

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?t=${new Date().getTime()}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=100&t=${new Date().getTime()}`)
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      const orders = Array.isArray(ordersData) ? ordersData : [];
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
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 translate-y-0 pb-20">
      
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          Dashboard Overview
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Business Analytics & Alerts
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 text-[#78a59b] animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#e2f0ed] text-[#4a7c73] rounded-full flex items-center justify-center border border-[#d1e7e2]">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Total Revenue</h3>
              <p className="font-serif text-3xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Active Orders</h3>
              <p className="font-serif text-3xl font-bold text-gray-900">{stats.activeOrders}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center border border-purple-100">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Catalog Size</h3>
              <p className="font-serif text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8">
              <div className="flex items-center space-x-3 mb-6">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h2 className="font-serif text-xl font-bold text-gray-900">Low Stock Alerts</h2>
              </div>
              
              {stats.lowStockItems.length === 0 ? (
                <div className="py-8 text-center bg-gray-50/50 rounded-3xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Inventory levels are healthy.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {stats.lowStockItems.map(item => (
                    <div key={item._id} className="flex items-center justify-between p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] uppercase tracking-widest text-rose-500 font-bold mt-1">Only {item.stock} left</p>
                        </div>
                      </div>
                      <Link href="/admin/inventory" className="text-xs font-bold text-gray-900 hover:text-[#4a7c73] transition-colors">
                        Restock
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8 flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Management Portal</h2>
                <p className="text-sm text-gray-500 mb-8">Quickly navigate to your storefront controls.</p>
              </div>
              
              <div className="space-y-4">
                <Link href="/admin/orders" className="group flex items-center justify-between p-5 bg-white/50 hover:bg-white border border-white rounded-2xl active:scale-[0.98] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm hover:shadow-md">
                  <div className="flex items-center space-x-3 text-gray-900">
                    <ShoppingBag className="w-5 h-5 text-[#4a7c73]" />
                    <span className="text-sm font-bold tracking-wide">Process Orders</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#4a7c73] group-hover:translate-x-1 transition-all" />
                </Link>
                
                <Link href="/admin/products" className="group flex items-center justify-between p-5 bg-white/50 hover:bg-white border border-white rounded-2xl active:scale-[0.98] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm hover:shadow-md">
                  <div className="flex items-center space-x-3 text-gray-900">
                    <Package className="w-5 h-5 text-[#4a7c73]" />
                    <span className="text-sm font-bold tracking-wide">Product Catalog</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#4a7c73] group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}