import { useState } from 'react';
import { supabase } from '../client';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener pedidos del usuario
  const getUserOrders = async () => {
    if (!user) {
      return { data: [], error: 'No hay usuario autenticado' };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLoading(false);
      return { data: data || [], error: null };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { data: [], error: err.message };
    }
  };

  // Función para obtener favoritos del usuario
  const getUserFavorites = async () => {
    if (!user) {
      return { data: [], error: 'No hay usuario autenticado' };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase as any)
        .from('favorites')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setLoading(false);
      return { data: data || [], error: null };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { data: [], error: err.message };
    }
  };

  // Función para obtener el carrito del usuario
  const getUserCart = async () => {
    if (!user) {
      return { data: [], error: 'No hay usuario autenticado' };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await (supabase as any)
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setLoading(false);
      return { data: data || [], error: null };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { data: [], error: err.message };
    }
  };

  // Función para agregar un favorito
  const addFavorite = async (productId: number) => {
    if (!user) {
      return { error: 'No hay usuario autenticado' };
    }

    try {
      const { error } = await (supabase as any)
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Función para eliminar un favorito
  const removeFavorite = async (productId: number) => {
    if (!user) {
      return { error: 'No hay usuario autenticado' };
    }

    try {
      const { error } = await (supabase as any)
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Función para agregar al carrito
  const addToCart = async (productId: number, quantity: number = 1, size?: string) => {
    if (!user) {
      return { error: 'No hay usuario autenticado' };
    }

    try {
      // Verificar si el producto ya está en el carrito
      const { data: existing } = await (supabase as any)
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size || '')
        .single();

      if (existing) {
        // Actualizar cantidad
        const { error } = await (supabase as any)
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insertar nuevo item
        const { error } = await (supabase as any)
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            size: size || null,
          });

        if (error) throw error;
      }

      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Función para actualizar cantidad en el carrito
  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    if (!user) {
      return { error: 'No hay usuario autenticado' };
    }

    try {
      if (quantity === 0) {
        // Eliminar del carrito
        const { error } = await (supabase as any)
          .from('cart_items')
          .delete()
          .eq('id', cartItemId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Actualizar cantidad
        const { error } = await (supabase as any)
          .from('cart_items')
          .update({ quantity })
          .eq('id', cartItemId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      return { error: null };
    } catch (err: any) {
      return { error: err.message };
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

