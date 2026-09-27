'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';
import { ArrowLeft, ShoppingBag, Heart, Loader2, Sparkles, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart;
  const openCart = cartContext?.setIsCartOpen || cartContext?.setIsOpen || cartContext?.toggleCart;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        router.push('/shop'); // Redirect back to shop if ID is invalid
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchSingleProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      if (addToCart && product) {
        addToCart({
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      setIsAdding(false);
      if (typeof openCart === 'function') openCart(true);
    }, 400); // Small delay for tactile button animation
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#78a59b] animate-spin" />
          <p className="font-serif text-lg text-gray-500 animate-pulse">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-[92%] xl:max-w-[1200px] mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-20">
        
        {/* Back Navigation */}
        <Link 
          href="/shop"
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <span>Back to Shop</span>
        </Link>

        {/* Main Product Card */}
        <div className="bg-white/60 backdrop-blur-3xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.04)] rounded-[3rem] sm:rounded-[4rem] p-6 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-20 relative overflow-hidden">
          
          {/* Left: Product Image */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-white/50 rounded-[2.5rem] sm:rounded-[3rem] p-4 border border-white shadow-sm relative group">
              <button className="absolute top-8 right-8 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 z-10 transition-all shadow-sm active:scale-90">
                <Heart className="w-5 h-5" />
              </button>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-[2rem] sm:rounded-[2.5rem] group-hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white shadow-sm mb-6 w-max">
              <Sparkles className="w-3.5 h-3.5 text-[#4a7c73]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4a7c73]">
                {product.category || 'Premium Collection'}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-4">
              {product.name}
            </h1>

            <div className="flex items-center space-x-2 mb-8">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-2 border-l border-gray-300">
                124 Reviews
              </span>
            </div>

            <p className="font-serif text-3xl sm:text-4xl text-gray-900 mb-8">
              ${product.price?.toFixed(2)}
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-10">
              {product.description}
            </p>

            <div className="flex items-center space-x-4 pb-10 border-b border-gray-200/50 mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Availability:</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-[#4a7c73]' : 'text-rose-500'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isAdding || product.stock <= 0}
              className="group flex items-center justify-center space-x-3 w-full bg-black text-white px-8 py-5 rounded-full font-bold text-sm uppercase tracking-[0.15em] hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>{product.stock > 0 ? 'Add to Bag' : 'Sold Out'}</span>
                </>
              )}
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}