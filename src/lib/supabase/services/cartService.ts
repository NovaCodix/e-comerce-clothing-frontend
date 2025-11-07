import { supabase } from '../client';

export const cartService = {
  /**
   * Obtiene todos los items del carrito de un usuario
   */
  async getCart(userId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  /**
   * Agrega un producto al carrito
   */
  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    size: string,
    color: string
  ) {
    // Verificar si el item ya existe
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color)
      .maybeSingle();

    if (existing) {
      // Si existe, actualizar cantidad
      const existingItem = existing as any;
      return this.updateQuantity(existingItem.id, existingItem.quantity + quantity);
    }

    // Si no existe, crear nuevo
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
        size,
        color,
      } as any)
      .select('*, products(*)')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza la cantidad de un item del carrito
   */
  async updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    const { data, error } = await (supabase as any)
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .select('*, products(*)')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Elimina un item del carrito
   */
  async removeFromCart(itemId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return true;
  },

  /**
   * Limpia todo el carrito de un usuario
   */
  async clearCart(userId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  /**
   * Obtiene el total del carrito
   */
  async getCartTotal(userId: string) {
    const items = await this.getCart(userId);
    
    return items.reduce((total: number, item: any) => {
      const product = item.products;
      const price = product?.discount_price || product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  },
};
