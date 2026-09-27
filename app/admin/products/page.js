'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminProducts() {
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Track if we are editing an existing product
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Skincare',
    price: '',
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
      const response = await fetch('http://localhost:5001/api/products?limit=50');
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

  // Populate form with existing product data for editing
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category || 'Skincare',
      price: product.price,
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

      // 1. Upload new file to Cloudinary (if selected)
      if (fileInput && fileInput.files[0]) {
        const uploadData = new FormData();
        uploadData.append('image', fileInput.files[0]);

        const uploadRes = await fetch('http://localhost:5001/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (!uploadRes.ok) throw new Error('Image upload to Cloudinary failed');
        
        const uploadJson = await uploadRes.json();
        finalImageUrl = uploadJson.imageUrl; 
      }

      if (!finalImageUrl) {
        finalImageUrl = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000';
      }

      // 2. Determine if POST (Create) or PUT (Update)
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5001/api/products/${editingId}` 
        : 'http://localhost:5001/api/products';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          rating: parseFloat(formData.rating),
          image: finalImageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to save product in Database');

      // 3. Clean up UI
      await fetchProducts();
      setIsCreating(false);
      setEditingId(null);
      setFormData({ name: '', category: 'Skincare', price: '', stock: '', description: '', image: '', isSale: false, rating: 5.0 });
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
      const response = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  // Reset form when clicking cancel
  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', category: 'Skincare', price: '', stock: '', description: '', image: '', isSale: false, rating: 5.0 });
  };

  return (
    <div className={`transition-opacity duration-500 ease-out outline-none ${isMounted ? 'opacity-100' : 'opacity-0'}`} tabIndex={-1}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">Manage Storefront & Database</p>
        </div>
        
        <button 
          onClick={isCreating ? handleCancel : () => setIsCreating(true)}
          className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 active:scale-95 transition-all shadow-md w-max cursor-pointer"
        >
          {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isCreating ? 'Cancel' : 'New Product'}</span>
        </button>
      </div>

      {/* Inline Form */}
      {isCreating && (
        <form onSubmit={handleSave} className="mb-10 bg-white/80 backdrop-blur-2xl border border-white shadow-[0_12px_40px_rgba(0,0,0,0.05)] rounded-[3rem] p-8 sm:p-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
            {editingId ? 'Edit Product' : 'Publish New Item'}
          </h3>
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold uppercase tracking-wider">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="flex flex-col space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Product Image</label>
              <div className="w-full aspect-square bg-white/50 border border-gray-200 rounded-[2rem] flex flex-col items-center justify-center p-4 text-gray-400">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-[1.5rem] mb-3" />
                ) : (
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <ImageIcon className="w-6 h-6 opacity-50" />
                  </div>
                )}
                
                <div className="flex flex-col space-y-2 w-full mt-2">
                  <input 
                    type="file" 
                    id="imageUpload"
                    accept="image/*"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-[#e2f0ed] file:text-[#4a7c73] hover:file:bg-[#d1e7e2] transition-all cursor-pointer"
                  />
                  <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest mt-1">Upload JPG or PNG</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Radiant Glow Serum" 
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40"
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Fragrance">Fragrance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    name="price"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00" 
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Stock</label>
                  <input 
                    type="number" 
                    name="stock"
                    required
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="50" 
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Rating</label>
                  <input 
                    type="number" 
                    name="rating"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="5.0" 
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/50 border border-gray-200 rounded-2xl px-5 py-3">
                <input 
                  type="checkbox" 
                  name="isSale"
                  id="isSaleCheckbox"
                  checked={formData.isSale}
                  onChange={handleChange}
                  className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black cursor-pointer"
                />
                <label htmlFor="isSaleCheckbox" className="text-xs font-bold uppercase tracking-wider text-gray-700 cursor-pointer">
                  Mark as On Sale (Featured in Sale Tab)
                </label>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Description</label>
                <textarea 
                  name="description"
                  required
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe benefits and ingredients..." 
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-black text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-gray-800 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-70"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
                  ) : (
                    <><Save className="w-4 h-4" /><span>{editingId ? 'Update Product' : 'Save to DB'}</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-[#78a59b] animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md border border-white rounded-[2.5rem] p-12 text-center">
          <p className="text-gray-500 font-medium text-sm">No products found in the database. Click "New Product" to add your first item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id || product.id} className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-[2.5rem] p-4 flex flex-col hover:shadow-md hover:bg-white/85 transition-all duration-300 group">
              
              <div className="aspect-square bg-gray-50 rounded-[2rem] overflow-hidden mb-4 border border-gray-100 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                {product.isSale && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    Sale
                  </span>
                )}
              </div>

              <div className="px-2 flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#4a7c73]">{product.category || 'Skincare'}</span>
                  <span className="text-xs font-semibold text-gray-500">★ {product.rating || 5.0}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mt-1">{product.name}</h3>
                <p className="font-serif text-lg text-gray-900 mt-2">${product.price?.toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-2 mt-4 px-2 pt-4 border-t border-white/60">
                <button 
                  onClick={() => handleEdit(product)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(product._id || product.id)}
                  className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-full transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}