'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Load cart from localStorage when the app starts
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('aq_beauty_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
  }, []);

  // 2. Save cart to localStorage automatically whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aq_beauty_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // Safely grab the ID regardless of how the database or frontend names it
      const productId = product._id || product.id;
      
      if (!productId) {
        console.error("Error: Product is missing an ID.", product);
        return prevCart; 
      }

      const existingItem = prevCart.find((item) => (item._id || item.id) === productId);
      
      if (existingItem) {
        return prevCart.map((item) =>
          (item._id || item.id) === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}