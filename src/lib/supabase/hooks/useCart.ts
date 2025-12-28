import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import type { CartItem as CartDrawerItem } from '../../../components/CartDrawer';
import type { Product } from '../../../components/ProductCard';

export function useCart(products: Product[]) {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartDrawerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Siempre usar localStorage como fuente principal en esta versión
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing cart from localStorage', err);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    setLoading(false);
  }, []);

  const saveCart = (items: CartDrawerItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to localStorage', err);
    }
  };

  const addToCart = async (product: Product, size?: string) => {
    const selectedSize = size || (product.sizes && product.sizes[0]) || '';
    const existing = cartItems.find((i) => i.id === product.id && i.selectedSize === selectedSize);
    let newItems: CartDrawerItem[];
    if (existing) {
      newItems = cartItems.map((i) =>
        i.id === product.id && i.selectedSize === selectedSize ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...cartItems, { ...product, quantity: 1, selectedSize }];
    }
    saveCart(newItems);
  };

  const updateQuantity = async (id: number, quantity: number) => {
    let newItems: CartDrawerItem[];
    if (quantity === 0) {
      newItems = cartItems.filter((item) => item.id !== id);
    } else {
      newItems = cartItems.map((item) => (item.id === id ? { ...item, quantity } : item));
    }
    saveCart(newItems);
  };

  const removeItem = async (id: number) => {
    const newItems = cartItems.filter((item) => item.id !== id);
    saveCart(newItems);
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}

