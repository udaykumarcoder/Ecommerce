import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '../services/catalog';
import type { Category, Product } from '../types';

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getProducts(), getCategories()])
      .then(([productData, categoryData]) => {
        if (!mounted) return;
        setProducts(productData);
        setCategories(categoryData);
        setError(null);
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setError(error instanceof Error ? error.message : 'Unable to load catalog.');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return { products, categories, loading, error };
}
