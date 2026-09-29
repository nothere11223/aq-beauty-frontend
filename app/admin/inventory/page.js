'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, AlertCircle, TrendingUp, Edit2, Check, X, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const adminToken = localStorage.getItem('aq_admin_token');
      const res = await fetch(`${API_URL}/api/products?limit=100`, {
        headers: {
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        }
      });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditValue(product.stock || 0);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSaveStock = async (id) => {
    setIsSaving(true);
    try {
      const adminToken = localStorage.getItem('aq_admin_token');
      if (!adminToken) {
        alert('Admin token missing. Please log in again.');
        return;
      }

      const res = await fetch(`${API_URL}/api/products/${id}/stock`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ stock: Number(editValue) }),
      });

      if (res.ok) {
        setProducts(prev => 
          prev.map(p => p._id === id ? { ...p, stock: Number(editValue) } : p)
        );
        setEditingId(null);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Backend Error: ${errorData.error || 'Failed to update stock'}`);
      }
    } catch (err) {
      console.error('Stock update network error:', err);
      alert(`Network Error: Is your backend running?`);
    } finally {
      setIsSaving(false);
    }
  };

  const getStockStatus = (stockValue) => {
    const stock = Number(stockValue) || 0;
    if (stock > 15) return { label: 'In Stock', type: 'good' };
    if (stock > 0) return { label: 'Low Stock', type: 'warning' };
    return { label: 'Out of Stock', type: 'critical' };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      <Link 
        href="/admin" 
        className="inline-flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm group cursor-pointer w-max"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Inventory Control</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">Real-time Stock Levels</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400 font-serif text-lg animate-pulse">
          Loading inventory database...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-[2rem] border border-white p-8">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <h3 className="font-serif text-xl font-bold text-gray-700">No Products Found</h3>
          <p className="text-xs text-gray-400 mt-1">Add products in the catalog to manage their inventory here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((item) => {
            const status = getStockStatus(item.stock);
            const isEditing = editingId === item._id;

            return (
              <div 
                key={item._id} 
                className="bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-[2rem] p-5 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-all duration-300 gap-4"
              >
                
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Layers className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-[10px] font-mono text-gray-500 mt-1">ID: {item._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-6 md:w-1/2">
                  
                  <div className={`hidden sm:flex px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest items-center space-x-1.5 flex-shrink-0 ${
                    status.type === 'good' ? 'bg-[#e2f0ed] border-[#d1e7e2] text-[#4a7c73]' :
                    status.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                    'bg-rose-50 border-rose-100 text-rose-600'
                  }`}>
                    {status.type === 'good' ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    <span>{status.label}</span>
                  </div>

                  <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm min-w-[140px] justify-end">
                    {isEditing ? (
                      <>
                        <input 
                          type="number" 
                          min="0"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 text-center text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 rounded-md py-1"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSaveStock(item._id)} 
                          disabled={isSaving}
                          className="p-1.5 bg-[#4a7c73] hover:bg-[#3a615a] text-white rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-right mr-2">
                          <p className="text-sm font-bold text-gray-900 leading-none">{item.stock || 0}</p>
                          <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Units Left</p>
                        </div>
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-full border border-gray-200 transition-colors active:scale-95 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}