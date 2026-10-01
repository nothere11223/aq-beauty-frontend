'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Loader2 } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating a network request for the UI
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f5] via-[#e2f0ed] to-[#d1e7e2] text-gray-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-[92%] xl:max-w-[1200px] mx-auto px-4 sm:px-8 pt-36 pb-24">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#78a59b] mb-2 block">Concierge Services</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Client Support</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            Whether you need assistance with an order, product recommendations, or partnership inquiries, our dedicated team is here to help.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Contact Information Cards */}
          <div className="w-full lg:w-1/3 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            
            <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-6">
                <Mail className="w-5 h-5 text-[#4a7c73]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-xs text-gray-500 mb-4">Expect a reply within 24 hours.</p>
              <a href="mailto:orakzaiabdul70@gmail.com" className="text-sm font-bold text-gray-900 hover:text-[#4a7c73] transition-colors">
                orakzaiabdul70@gmail.com
              </a>
            </div>

            <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-6">
                <Phone className="w-5 h-5 text-[#4a7c73]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-xs text-gray-500 mb-4">Available Mon-Fri, 9am - 6pm (PKT).</p>
              <a href="tel:+923140051441" className="text-sm font-bold text-gray-900 hover:text-[#4a7c73] transition-colors">
                +92 314 0051441
              </a>
            </div>

            <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-6">
                <MapPin className="w-5 h-5 text-[#4a7c73]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Headquarters</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                AQ Beauty Studio<br />
                Ring Road (Opposite Abasyn University,near Patang Chowk)<br />
                Peshawar, Khyber Pakhtunkhwa<br />
                Pakistan
              </p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-2/3 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
            <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl">
              
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-100">
                <MessageSquare className="w-6 h-6 text-[#78a59b]" />
                <h2 className="font-serif text-2xl font-bold text-gray-900">Send a Message</h2>
              </div>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
                  <CheckCircle className="w-16 h-16 text-[#4a7c73] mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Message Sent</h3>
                  <p className="text-gray-500 text-sm">Thank you for reaching out. Our concierge team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Your Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 transition-shadow" 
                        placeholder="Jane Doe" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 transition-shadow" 
                        placeholder="jane@example.com" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Subject</label>
                    <input 
                      type="text" 
                      name="subject" 
                      required 
                      value={formData.subject} 
                      onChange={handleChange} 
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 transition-shadow" 
                      placeholder="Order Inquiry / Product Question" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2 block mb-1.5">Message</label>
                    <textarea 
                      name="message" 
                      required 
                      rows="5" 
                      value={formData.message} 
                      onChange={handleChange} 
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a59b]/40 resize-none transition-shadow" 
                      placeholder="How can we assist you today?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center justify-center space-x-2 w-full bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}