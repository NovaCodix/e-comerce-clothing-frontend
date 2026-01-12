import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import type { CartItem as CartDrawerItem } from '../../../components/CartDrawer';
import type { Product } from '../../../components/ProductCard';

export function useCart(products: Product[]) {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartDrawerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validación de integridad del carrito
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsedCart: CartDrawerItem[] = JSON.parse(saved);
        
        // Crear un Set de IDs válidos para búsqueda O(1)
        const validProductIds = new Set(
          products.map(p => typeof p.id === 'string' ? p.id : String(p.id))
        );
        
        // Filtrar solo productos que aún existen en la base de datos
        const validItems = parsedCart.filter(item => {
          const itemId = typeof item.id === 'string' ? item.id : String(item.id);
          return validProductIds.has(itemId);
        });
        
        // Si se eliminaron items inválidos, actualizar localStorage
        if (validItems.length !== parsedCart.length) {
          const removedCount = parsedCart.length - validItems.length;
          console.info(`🧹 Carrito limpiado: ${removedCount} producto(s) eliminado(s) ya no existen`);
          
          // Actualizar localStorage con la lista limpia
          if (validItems.length > 0) {
            localStorage.setItem('cart', JSON.stringify(validItems));
          } else {
            localStorage.removeItem('cart');
          }
        }
        
        setCartItems(validItems);
      } catch (err) {
        console.error('Error parsing cart from localStorage', err);
        setCartItems([]);
        localStorage.removeItem('cart');
      }
    } else {
      setCartItems([]);
    }
    setLoading(false);
  }, [products]); // Dependencia: ejecutar validación cuando cambie la lista de productos

  const saveCart = (items: CartDrawerItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to localStorage', err);
    }
  };

  const addToCart = async (product: Product, size?: string, color?: string) => {
    const selectedSize = size || (product.sizes && product.sizes[0]) || '';
    const selectedColor = color || (product.colors && product.colors[0]) || '';
    
    // Buscar la variante específica que coincida con talla y color
    const variant = product.variants?.find(v => 
      v.size === selectedSize && v.color === selectedColor
    );
    
    if (!variant) {
      console.error('No se encontró variante para', selectedSize, selectedColor);
      return;
    }

    const existing = cartItems.find((i) => i.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor);
    let newItems: CartDrawerItem[];
    
    if (existing) {
      newItems = cartItems.map((i) =>
        i.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
      );
    } else {
      newItems = [...cartItems, { 
        ...product, 
        quantity: 1, 
        selectedSize, 
        selectedColor,
        variantId: variant.id // Guardar el ID de la variante
      }];
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