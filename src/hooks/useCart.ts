import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface CartItem {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  category: string;
  cover_image?: string;
  author_name: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('oracle_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [checkoutPreferenceId, setCheckoutPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('oracle_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    if (cartItems.some(i => i.id === item.id)) return;
    setCartItems(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCheckoutUrl(null);
    setCheckoutPreferenceId(null);
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + Number(item.price), 0);
  };

  const getTax = () => {
    // Simulated processing fee or platform split showcase
    return getSubtotal() * 0.05; // 5% processing fee
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const checkoutWithMercadoPago = async (): Promise<any | null> => {
    if (cartItems.length === 0) return null;
    setCheckoutLoading(true);
    try {
      const itemIds = cartItems.map(item => item.id.toString());
      const res = await api.payment.createPreference(itemIds);
      if (res) {
        if (res.preferenceId) setCheckoutPreferenceId(res.preferenceId);
        if (res.init_point) setCheckoutUrl(res.init_point);
        return res;
      }
      return null;
    } catch (error) {
      console.error('Mercado Pago checkout preference error:', error);
      // Fallback: Simulation of purchase directly
      return null;
    } finally {
      setCheckoutLoading(false);
    }
  };

  const completeSimulationPurchase = async (): Promise<boolean> => {
    if (cartItems.length === 0) return false;
    setCheckoutLoading(true);
    try {
      const itemIds = cartItems.map(item => item.id.toString());
      const res = await api.marketplace.purchase(itemIds);
      if (res && res.success) {
        clearCart();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Simulated purchase error:', err);
      return false;
    } finally {
      setCheckoutLoading(false);
    }
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
    checkoutLoading,
    checkoutUrl,
    checkoutPreferenceId,
    setCheckoutPreferenceId,
    checkoutWithMercadoPago,
    completeSimulationPurchase
  };
}
