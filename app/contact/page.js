'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-8 pt-36 pb-24">
        
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#78a59b] mb-2 block">Client Care</span>
          <h1 className="font-serif text-4xl font-bold text-gray-900">How Can We Help You?</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Contact Information Cards */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-8 space-y-6">
              <h3 className="font-serif text-2xl font-bold text-gray-900">Get in Touch</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our luxury concierge team is available around the clock to assist you with order inquiries, product recommendations, and custom skincare consultations.
              </p>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#78a59b]/10 text-[#78a59b] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Email Us</span>
                    <span className="text-sm font-semibold text-gray-800">support@aqbeauty.com</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#78a59b]/10 text-[#78a59b] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Call Concierge</span>
                    <span className="text-sm font-semibold text-gray-800">+1 (800) 555-AQBEAUTY</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#78a59b]/10 text-[#78a59b] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Headquarters</span>
                    <span className="text-sm font-semibold text-gray-800">Beverly Hills, California</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="bg-white/85 backdrop-blur-3xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[3rem] p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#78a59b] mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-gray-900">Message Received</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Thank you for reaching out. A client care specialist has received your request and will email you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-white/60 border border-white focus:border-[#78a59b] outline-none rounded-2xl px-5 py-4 text-sm transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. sarah@example.com"
                    className="w-full bg-white/60 border border-white focus:border-[#78a59b] outline-none rounded-2xl px-5 py-4 text-sm transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1">Message / Inquiry</label>
                  <textarea 
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we assist your routine today?"
                    className="w-full bg-white/60 border border-white focus:border-[#78a59b] outline-none rounded-2xl px-5 py-4 text-sm transition-all shadow-sm resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="group w-full flex items-center justify-center space-x-2 bg-black text-white rounded-full py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg mt-2 cursor-pointer"
                >
                  <span>Transmit Inquiry</span>
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}