'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminProducts() {
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Skincare',
    price: '',
    salePrice: '',
    stock: '',
    description: '',
    image: '',
    isSale: false,
    rating: 5.0,
  });

  useEffect(() => {
    setIsMounted(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=50`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      const productArray = Array.isArray(data) ? data : (data.products || []);
      setProducts(productArray);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category || 'Skincare',
      price: product.price,
      salePrice: product.salePrice || '',
      stock: product.stock,
      description: product.description,
      image: product.image,
      isSale: product.isSale || false,
      rating: product.rating || 5.0,
    });
    setEditingId(product._id || product.id);
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    try {
      let finalImageUrl = formData.image; 
      const fileInput = document.getElementById('imageUpload');

      if (fileInput && fileInput.files[0]) {
        const uploadData = new FormData();
        uploadData.append('image', fileInput.files[0]);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: 'POST',
          body: uploadData,
        });

        if (!uploadRes.ok) throw new Error('Image upload failed');
        
        const uploadJson = await uploadRes.json();
        finalImageUrl = uploadJson.imageUrl; 
      }

      if (!finalImageUrl) {
        finalImageUrl = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000';
      }

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

      let parsedSalePrice = null;
      if (formData.isSale && formData.salePrice) {
        parsedSalePrice = parseFloat(formData.salePrice);
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          salePrice: parsedSalePrice,
          stock: parseInt(formData.stock, 10),
          rating: parseFloat(formData.rating),
          image: finalImageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to save product in Database');

      await fetchProducts();
      setIsCreating(false);
      setEditingId(null);
      setFormData({ name: '', category: 'Skincare', price: '', salePrice: '', stock: '', description: '', image: '', isSale: false, rating: 5.0 });
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', category: 'Skincare', price: '', salePrice: '', stock: '', description: '', image: '', isSale: false, rating: 5.0 });
  };

  return (
    <div className={`transition-opacity duration-500 ease-out outline-none pb-20 ${isMounted ? 'opacity-100' : 'opacity-0'}`} tabIndex={-1}>
      
      <Link href="/admin" className="inline-flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm mb-6 group cursor-pointer w-max">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Manage Storefront & Database</p>
        </div>
        
        <button onClick={isCreating ? handleCancel : () => setIsCreating(true)} className="flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 active:scale-95 transition-all shadow-md w-max cursor-pointer">
          {isCreating ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isCreating ? 'Cancel' : 'New Product'}</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSave} className="mb-8 bg-white/80 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-5">
            {editingId ? 'Edit Product' : 'Publish New Item'}
          </h3>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold uppercase tracking-wider">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Product Image</label>
              <div className="w-full aspect-square bg-white/50 border border-gray-200 rounded-[2rem] flex flex-col items-center justify-center p-3 text-gray-400">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-[1.5rem] mb-2" />
                ) : (
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                    <ImageIcon className="w-5 h-5 opacity-50" />
                  </div>
                )}
                
                <input type="file" id="imageUpload" accept="image/*" className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs focus:outline-none file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[9px] file:uppercase file:tracking-widest file:font-bold file:bg-[#e2f0ed] file:text-[#4a7c73] cursor-pointer" />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 block mb-1">Product Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Radiant Glow Serum" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 block mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-xs text-gray-900 focus:outline-none">
                    <option value="Skincare">Skincare</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Fragrance">Fragrance</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 block mb-1">Base Price (Rs.)</label>
                  <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} placeholder="0" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 block mb-1">Stock</label>
                  <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} placeholder="50" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 block mb-1">Rating</label>
                  <input type="number" name="rating" step="0.1" min="1" max="5" value={formData.rating} onChange={handleChange} placeholder="5.0" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2.5 bg-white/50 border border-gray-200 rounded-xl px-4 py-2.5 h-[42px]">
                  <input type="checkbox" name="isSale" id="isSaleCheckbox" checked={formData.isSale} onChange={handleChange} className="w-4 h-4 text-black rounded border-gray-300 cursor-pointer" />
                  <label htmlFor="isSaleCheckbox" className="text-[10px] font-bold uppercase tracking-wider text-gray-700 cursor-pointer">
                    On Sale
                  </label>
                </div>
                
                {formData.isSale && (
                  <div className="flex-1">
                    <input type="number" name="salePrice" min="0" required={formData.isSale} value={formData.salePrice} onChange={handleChange} placeholder="Discounted Price (Rs.)" className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1 block mb-1">Description</label>
                <textarea name="description" required rows="2" value={formData.description} onChange={handleChange} placeholder="Describe benefits..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-900 focus:outline-none resize-none"></textarea>
              </div>

              <div className="flex justify-end pt-1">
                <button type="submit" disabled={isSaving} className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-gray-800 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-70">
                  {isSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Saving...</span></> : <><Save className="w-3.5 h-3.5" /><span>{editingId ? 'Update Product' : 'Save to DB'}</span></>}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-7 h-7 text-[#78a59b] animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] p-10 text-center">
          <p className="text-gray-500 font-medium text-xs">No products found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id || product.id} className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-[2rem] p-3 flex flex-col hover:shadow-md hover:bg-white/85 transition-all duration-300 group">
              
              <div className="aspect-square bg-gray-50 rounded-[1.5rem] overflow-hidden mb-3 border border-gray-100 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {product.isSale && (
                  <span className="absolute top-2 left-2 bg-rose-500 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">
                    Sale
                  </span>
                )}
              </div>

              <div className="px-1 flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#4a7c73]">{product.category || 'Skincare'}</span>
                  <span className="text-[10px] font-semibold text-gray-500">★ {product.rating || 5.0}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-xs mt-0.5 line-clamp-1">{product.name}</h3>
                
                <div className="flex items-center space-x-1.5 mt-1">
                  {product.isSale && product.salePrice ? (
                    <>
                      <p className="font-serif text-sm text-rose-500">Rs. {product.salePrice.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 line-through">Rs. {product.price.toLocaleString()}</p>
                    </>
                  ) : (
                    <p className="font-serif text-sm text-gray-900">Rs. {product.price.toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1.5 mt-3 px-1 pt-3 border-t border-white/60">
                <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-full text-[10px] font-bold transition-colors cursor-pointer">
                  <Edit2 className="w-3 h-3" /><span>Edit</span>
                </button>
                <button onClick={() => handleDelete(product._id || product.id)} className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-full transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}