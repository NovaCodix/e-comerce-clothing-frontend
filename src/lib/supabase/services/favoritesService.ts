import { supabase } from '../client';

export const favoritesService = {
  /**
   * Obtiene todos los favoritos de un usuario
   */
  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  /**
   * Agrega un producto a favoritos
   */
  async addToFavorites(userId: string, productId: string) {
    const { data, error } = await (supabase as any)
      .from('favorites')
      .insert({
        user_id: userId,
        product_id: productId,
      })
      .select('*, products(*)')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Elimina un producto de favoritos
   */
  async removeFromFavorites(userId: string, productId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    return true;
  },

  /**
   * Verifica si un producto está en favoritos
   */
  async isFavorite(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  /**
   * Alterna el estado de favorito de un producto
   */
  async toggleFavorite(userId: string, productId: string) {
    const isFav = await this.isFavorite(userId, productId);

    if (isFav) {
      await this.removeFromFavorites(userId, productId);
      return false;
    } else {
      await this.addToFavorites(userId, productId);
      return true;
    }
  },
};
