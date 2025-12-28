import { useEffect, useState } from 'react';

// Hook simple para productos. Intenta obtener desde `/api/products` si existe,
// si no, devuelve array vacío. Mantiene la API original (products, loading, error).

type Product = any;

export function useProducts(categoryId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const resp = await fetch('/api/products');
        if (!resp.ok) throw new Error('No products endpoint');
        const data = await resp.json();
        setProducts(data || []);
      } catch (err) {
        // Si no existe endpoint, fallback a vacío (App usa mockProducts)
        setError(err as Error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`/api/products/${productId}`);
        if (!resp.ok) throw new Error('No product endpoint');
        const data = await resp.json();
        setProduct(data);
      } catch (err) {
        setError(err as Error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  return { product, loading, error };
}
