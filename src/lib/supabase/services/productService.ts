import { supabase } from '../client';

export const productService = {
  /**
   * Obtiene todos los productos
   */
  async getProducts(options?: {
    categoryId?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('products')
      .select('*, categories(*)');

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (options?.featured) {
      query = query.eq('is_featured', true);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene un producto por ID
   */
  async getProduct(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Busca productos por nombre o descripción
   */
  async searchProducts(searchTerm: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

    if (error) throw error;
    return data;
  },

  /**
   * Crea un nuevo producto (admin)
   */
  async createProduct(product: any) {
    const { data, error } = await (supabase as any)
      .from('products')
      .insert(product)
      .select('*, categories(*)')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza un producto (admin)
   */
  async updateProduct(productId: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select('*, categories(*)')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Elimina un producto (admin)
   */
  async deleteProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return true;
  },

  /**
   * Actualiza el stock de un producto
   */
  async updateStock(productId: string, quantity: number) {
    const { data, error } = await (supabase as any)
      .from('products')
      .update({ stock: quantity })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
