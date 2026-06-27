import { categories, products } from '../data/sampleData';
import { hasSupabaseConfig, supabase } from '../lib/supabase';
import type { Category, Product } from '../types';

type ProductRow = Product & {
  product_images?: Array<{ product_id?: string; image_url: string; sort_order: number }>;
};

async function attachProductRelations(items: ProductRow[]): Promise<ProductRow[]> {
  if (!supabase || items.length === 0) return items;
  const productIds = items.map((item) => item.id);
  const categoryIds = [...new Set(items.map((item) => item.category_id).filter(Boolean))];
  const [{ data: images }, { data: categories }] = await Promise.all([
    supabase.from('product_images').select('product_id, image_url, sort_order').in('product_id', productIds),
    categoryIds.length ? supabase.from('categories').select('*').in('id', categoryIds) : Promise.resolve({ data: [] }),
  ]);
  return items.map((item) => ({
    ...item,
    category: categories?.find((category) => category.id === item.category_id),
    product_images: images?.filter((image) => image.product_id === item.id) ?? [],
  }));
}

function normalizeProduct(item: ProductRow): Product {
  return {
    ...item,
    images: item.product_images?.sort((a, b) => a.sort_order - b.sort_order).map((image) => image.image_url) ?? item.images ?? [],
    specifications: item.specifications ?? {},
    tags: item.tags ?? [],
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!supabase) return categories;
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) {
    if (hasSupabaseConfig) throw error;
    return categories;
  }
  return data ?? [];
}

export async function getProducts(): Promise<Product[]> {
  if (!supabase) return products;
  const { data, error } = await supabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false });
  if (error) {
    if (hasSupabaseConfig) throw error;
    return products;
  }
  return (await attachProductRelations((data ?? []) as ProductRow[])).map((item) => normalizeProduct(item));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const allProducts = await getProducts();
  return allProducts.find((product) => product.slug === slug || product.id === slug);
}
