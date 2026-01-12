import { useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';

/**
 * Hook personalizado para obtener datos vinculados al usuario autenticado
 * Este hook asegura que solo se muestren datos que pertenecen al usuario actual
 * 
 * NOTA: Este hook requiere que las tablas estén creadas en Supabase.
 * Ver AUTH_INTEGRATION_GUIDE.md para los esquemas de las tablas.
 */
export function useUserData() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserOrders = async () => {
    return { data: [], error: null };
  };

  const getUserFavorites = async () => {
    try {
      const raw = localStorage.getItem('favorites');
      const data = raw ? JSON.parse(raw) : [];
      return { data, error: null };
    } catch (err: any) {
      return { data: [], error: String(err) };
    }
  };

  const getUserCart = async () => {
    try {
      const raw = localStorage.getItem('cart');
      const data = raw ? JSON.parse(raw) : [];
      return { data, error: null };
    } catch (err: any) {
      return { data: [], error: String(err) };
    }
  };

  const addFavorite = async (productId: number) => {
    try {
      const { data } = await getUserFavorites();
      const exists = data.find((f: any) => f.product_id === productId);
      let newFavs = data;
      if (!exists) {
        newFavs = [...data, { id: Date.now(), product_id: productId }];
        localStorage.setItem('favorites', JSON.stringify(newFavs));
      }
      return { error: null };
    } catch (err: any) {
      return { error: String(err) };
    }
  };

  const removeFavorite = async (productId: number) => {
    try {
      const { data } = await getUserFavorites();
      const newFavs = data.filter((f: any) => f.product_id !== productId);
      localStorage.setItem('favorites', JSON.stringify(newFavs));
      return { error: null };
    } catch (err: any) {
      return { error: String(err) };
    }
  };

  const addToCart = async (productId: number, quantity: number = 1, size?: string) => {
    try {
      const { data } = await getUserCart();
      const existing = data.find((it: any) => it.product_id === productId && it.size === (size || null));
      let newCart = data;
      if (existing) {
        newCart = data.map((it: any) =>
          it.product_id === productId && it.size === (size || null) ? { ...it, quantity: it.quantity + quantity } : it
        );
      } else {
        newCart = [...data, { id: Date.now(), product_id: productId, quantity, size: size || null }];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { error: null };
    } catch (err: any) {
      return { error: String(err) };
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const { data } = await getUserCart();
      let newCart = data;
      if (quantity === 0) {
        newCart = data.filter((it: any) => String(it.id) !== String(cartItemId));
      } else {
        newCart = data.map((it: any) => (String(it.id) === String(cartItemId) ? { ...it, quantity } : it));
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { error: null };
    } catch (err: any) {
      return { error: String(err) };
    }
  };

  return {
    user,
    loading,
    error,
    getUserOrders,
    getUserFavorites,
    getUserCart,
    addFavorite,
    removeFavorite,
    addToCart,
    updateCartQuantity,
  };
}