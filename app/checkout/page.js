'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { Loader2, CheckCircle, ArrowLeft, Wallet, CreditCard, Receipt } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const cartContext = useCart();
  
  const cart = cartContext?.cart || [];
  const clearCart = cartContext?.clearCart || (() => {});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [transactionId, setTransactionId] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    city: '', 
    address: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqbeautybackend-3i3sw4y5.b4a.run';

  useEffect(() => {
    const savedUser = localStorage.getItem('aq_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setFormData(prev => ({
          ...prev,
          customerName: parsed.name || '',
          email: parsed.email || '',
        }));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, []);

  const cartTotal = cart.reduce((total, item) => {
    const activePrice = item.isSale && item.salePrice ? item.salePrice : item.price;
    return total + (activePrice * item.quantity);
  }, 0);
  
  const shipping = cartTotal > 0 ? 500.00 : 0;
  const finalTotal = cartTotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMethod === 'Manual Transfer' && !transactionId.trim()) {
      alert("Please enter the Transaction ID or Reference Number from your NayaPay, Easypaisa, or Bank App.");
      return;
    }
    
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    // Combine transaction ID into the payment method field for the backend to read if it's a manual transfer
    const finalizedPaymentMethod = paymentMethod === 'Manual Transfer' 
      ? `Manual Transfer (Txn ID: ${transactionId.trim()})` 
      : 'Cash on Delivery';

    const orderPayload = {
      ...formData,
      userId: currentUser ? (currentUser.userId || currentUser._id || currentUser.id) : null,
      items: cart.map(item => {
        const activePrice = item.isSale && item.salePrice ? item.salePrice : item.price;
        return {
          productId: item.id || item._id,
          name: item.name,
          price: activePrice,
          quantity: item.quantity,
          image: item.image
        };
      }),
      totalAmount: finalTotal,
      status: 'Pending',
      paymentMethod: finalizedPaymentMethod
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.message || 'Failed to place order');
      }
      
      clearCart();
      setIsSuccess(true);
    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.message || "There was an issue placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center px-4 pt-32 pb-20">
          <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-xl">
            <CheckCircle className="w-16 h-16 text-[#4a7c73] mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-bold mb-4">Order Confirmed</h1>
            <p className="text-gray-600 text-sm mb-8">
              Thank you for your purchase. Your order has been placed successfully and is pending verification.
            </p>
            <div className="space-y-3">
              <Link 
                href="/track-order"
                className="block w-full bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-gray-800 transition-all cursor-pointer shadow-md"
              >
                Track Live Order
              </Link>
              <Link 
                href="/shop"
                className="block w-full bg-white/80 border border-gray-200 text-gray-800 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-white transition-all cursor-pointer shadow-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-[92%] xl:max-w-[1200px] mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-32">
        
        <Link href="/shop" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8 group cursor-pointer">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shop</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          <div className="w-full lg:w-3/5 space-y-8">
            <div>
              <h1 className="font-serif text-4xl font-bold text-gray-900 tracking-tight mb-2">Checkout</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {currentUser ? `Signed in as ${currentUser.name}` : 'Checking out as Guest'}
              </p>
            </div>
            
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* Shipping Section */}
              <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#4a7c73] mb-4 border-b border-gray-200 pb-2">Shipping Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Full Name</label>
                    <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 shadow-sm" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Phone Number</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 shadow-sm" placeholder="+92 300 0000000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 shadow-sm" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">City</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 shadow-sm" placeholder="e.g. Peshawar" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Delivery Address</label>
                  <textarea name="address" required rows="3" value={formData.address} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 resize-none shadow-sm" placeholder="House 123, Street 4..."></textarea>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#4a7c73] mb-4 border-b border-gray-200 pb-2">Payment Method</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all shadow-sm ${
                      paymentMethod === 'Cash on Delivery' 
                        ? 'bg-black text-white border-black ring-2 ring-black/20' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Wallet className={`w-5 h-5 ${paymentMethod === 'Cash on Delivery' ? 'text-white' : 'text-gray-400'}`} />
                    <span className="text-sm font-bold">Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Manual Transfer')}
                    className={`flex items-center space-x-3 p-5 rounded-2xl border transition-all shadow-sm ${
                      paymentMethod === 'Manual Transfer' 
                        ? 'bg-black text-white border-black ring-2 ring-black/20' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'Manual Transfer' ? 'text-white' : 'text-gray-400'}`} />
                    <span className="text-sm font-bold">Manual Transfer</span>
                  </button>
                </div>

                {/* Manual Payment Instructions */}
                {paymentMethod === 'Manual Transfer' && (
                  <div className="mt-6 bg-[#f4f9f8] border border-[#78a59b]/30 rounded-2xl p-6 space-y-5 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-bold text-gray-900">NayaPay / Easypaisa</h4>
                      <p className="text-xs text-gray-600">Please transfer the total amount to the account below, then enter your transaction ID to verify.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Number / Phone</span>
                      <span className="font-mono text-xl font-bold text-gray-900 tracking-wider">03140051441</span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5 flex items-center">
                        <Receipt className="w-3 h-3 mr-1.5" />
                        Transaction ID / Reference No.
                      </label>
                      <input 
                        type="text" 
                        value={transactionId} 
                        onChange={(e) => setTransactionId(e.target.value)} 
                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 shadow-sm" 
                        placeholder="e.g. 123456789012" 
                      />
                    </div>
                  </div>
                )}
              </div>

            </form>
          </div>

          <div className="w-full lg:w-2/5">
            <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-[2.5rem] p-8 sm:p-10 shadow-lg sticky top-32">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {cart.length === 0 ? (
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                ) : (
                  cart.map((item, idx) => {
                    const activePrice = item.isSale && item.salePrice ? item.salePrice : item.price;
                    return (
                      <div key={idx} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold">Rs. {(activePrice * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 mb-8">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{cartTotal > 0 ? `Rs. ${shipping.toLocaleString()}` : 'Rs. 0'}</span>
                </div>
                <div className="flex justify-between text-xl font-serif font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isSubmitting || cart.length === 0}
                className="flex items-center justify-center space-x-2 w-full bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-gray-800 active:scale-98 transition-all disabled:opacity-50 shadow-xl cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>
                    Place Order ({paymentMethod === 'Cash on Delivery' ? 'COD' : 'Paid'})
                  </span>
                )}
              </button>
              
              {paymentMethod === 'Cash on Delivery' ? (
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">Payments collected upon delivery</p>
              ) : (
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">Awaiting manual verification</p>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}