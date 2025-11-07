import { supabase } from '../client';

export const categoryService = {
  /**
   * Obtiene todas las categorías
   */
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene una categoría por slug
   */
  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Crea una nueva categoría (admin)
   */
  async createCategory(category: any) {
    const { data, error } = await (supabase as any)
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
