import { useEffect, useState } from 'react';
import { supabase } from '../client';
import { useAuthContext } from '../../../contexts/AuthContext';
import type { CartItem as CartDrawerItem } from '../../../components/CartDrawer';
import type { Product } from '../../../components/ProductCard';

interface DbCartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
}

export function useCart(products: Product[]) {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartDrawerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito desde Supabase cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      loadCartFromDb();
    } else {
      // Si cierra sesión, limpiar carrito y cargar desde localStorage
      setCartItems([]);
      loadCartFromLocalStorage();
    }
  }, [user]);

  const loadCartFromDb = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        // Si la tabla no existe o hay un error de esquema
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('⚠️ Tabla cart_items no encontrada. El carrito usará localStorage.');
          loadCartFromLocalStorage();
          return;
        }
        throw error;
      }

      if (data && data.length > 0) {
        const items: CartDrawerItem[] = data
          .map((dbItem: any) => {
            const product = products.find((p) => p.id === dbItem.product_id);
            if (!product) return null;
            
            return {
              ...product,
              quantity: dbItem.quantity,
              selectedSize: product.sizes[0],
            };
          })
          .filter((item: CartDrawerItem | null): item is CartDrawerItem => item !== null);

        setCartItems(items);
      } else {
        // Si no hay items en la BD, establecer carrito vacío
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsedCart = JSON.parse(saved);
        setCartItems(parsedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error al cargar carrito del localStorage:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToLocalStorage = (items: CartDrawerItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = async (product: Product, size?: string) => {
    const selectedSize = size || product.sizes[0];

    if (user) {
      try {
        console.log('Agregando producto al carrito:', { 
          user_id: user.id, 
          product_id: product.id,
          product_name: product.name 
        });

        // Primero verificar si existe
        const { data: existing, error: selectError } = await (supabase as any)
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', String(product.id))
          .maybeSingle();

        if (selectError && selectError.code !== 'PGRST116') {
          // Si la tabla no existe, usar localStorage
          if (selectError.code === '42P01' || selectError.message?.includes('does not exist')) {
            console.warn('⚠️ Tabla cart_items no encontrada. Usando localStorage.');
            // Fallback a localStorage
            const existingItem = cartItems.find(
              (item) => item.id === product.id && item.selectedSize === selectedSize
            );
            let newItems: CartDrawerItem[];
            if (existingItem) {
              newItems = cartItems.map((item) =>
                item.id === product.id && item.selectedSize === selectedSize
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
            } else {
              newItems = [...cartItems, { ...product, quantity: 1, selectedSize }];
            }
            setCartItems(newItems);
            saveCartToLocalStorage(newItems);
            return;
          }
          console.error('Error completo al verificar:', selectError);
          throw selectError;
        }

        if (existing) {
          // Actualizar cantidad
          console.log('Producto ya existe, actualizando cantidad:', existing);
          const { error: updateError } = await (supabase as any)
            .from('cart_items')
            .update({ quantity: existing.quantity + 1 })
            .eq('id', existing.id);

          if (updateError) {
            console.error('Error completo al actualizar:', updateError);
            throw updateError;
          }
        } else {
          // Insertar nuevo
          console.log('Insertando nuevo producto en carrito');
          const { data: inserted, error: insertError } = await (supabase as any)
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: String(product.id),
              quantity: 1,
            })
            .select();

          if (insertError) {
            console.error('Error completo al insertar:', insertError);
            throw insertError;
          }
          
          console.log('Producto insertado:', inserted);
        }

        await loadCartFromDb();
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        throw error;
      }
    } else {
      const existingItem = cartItems.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      let newItems: CartDrawerItem[];
      if (existingItem) {
        newItems = cartItems.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...cartItems, { ...product, quantity: 1, selectedSize }];
      }

      setCartItems(newItems);
      saveCartToLocalStorage(newItems);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (user) {
      try {
        if (quantity === 0) {
          const { error } = await (supabase as any)
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', id);

          if (error) throw error;
        } else {
          const { data: existing } = await (supabase as any)
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', id)
            .maybeSingle();

          if (existing) {
            const { error } = await (supabase as any)
              .from('cart_items')
              .update({ quantity })
              .eq('id', existing.id);

            if (error) throw error;
          }
        }

        await loadCartFromDb();
      } catch (error) {
        console.error('Error al actualizar cantidad:', error);
      }
    } else {
      let newItems: CartDrawerItem[];
      if (quantity === 0) {
        newItems = cartItems.filter((item) => item.id !== id);
      } else {
        newItems = cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      }

      setCartItems(newItems);
      saveCartToLocalStorage(newItems);
    }
  };

  const removeItem = async (id: number) => {
    if (user) {
      try {
        const { error } = await (supabase as any)
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id);

        if (error) throw error;
        await loadCartFromDb();
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
      }
    } else {
      const newItems = cartItems.filter((item) => item.id !== id);
      setCartItems(newItems);
      saveCartToLocalStorage(newItems);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const { error } = await (supabase as any)
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        setCartItems([]);
      } catch (error) {
        console.error('Error al limpiar carrito:', error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  // Migrar carrito de localStorage a Supabase cuando inicia sesión
  useEffect(() => {
    const migrateCart = async () => {
      if (user) {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const items: CartDrawerItem[] = JSON.parse(localCart);
            
            console.log('Migrando carrito de localStorage a Supabase:', items);
            
            for (const item of items) {
              const { data: existing } = await (supabase as any)
                .from('cart_items')
                .select('*')
                .eq('user_id', user.id)
                .eq('product_id', String(item.id))
                .maybeSingle();

              if (existing) {
                await (supabase as any)
                  .from('cart_items')
                  .update({ quantity: existing.quantity + item.quantity })
                  .eq('id', existing.id);
              } else {
                await (supabase as any).from('cart_items').insert({
                  user_id: user.id,
                  product_id: String(item.id),
                  quantity: item.quantity,
                });
              }
            }

            localStorage.removeItem('cart');
            console.log('Carrito migrado exitosamente');
            await loadCartFromDb();
          } catch (error) {
            console.error('Error al migrar carrito:', error);
          }
        } else {
          console.log('No hay carrito en localStorage, cargando desde BD');
          await loadCartFromDb();
        }
      }
    };

    if (user) {
      migrateCart();
    }
  }, [user]);

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}

