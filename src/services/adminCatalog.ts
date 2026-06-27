import type { Category, Product } from '../types';
import { starterCategories, starterProducts } from '../data/starterCatalog';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

const PRODUCT_KEY = 'saif-admin-products';
const CATEGORY_KEY = 'saif-admin-categories';

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

function readProducts() {
  const saved = localStorage.getItem(PRODUCT_KEY);
  return saved ? JSON.parse(saved) as Product[] : starterProducts;
}

function writeProducts(items: Product[]) {
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(items));
}

function readCategories() {
  const saved = localStorage.getItem(CATEGORY_KEY);
  return saved ? JSON.parse(saved) as Category[] : starterCategories;
}

function writeCategories(items: Category[]) {
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(items));
}

export async function adminListProducts() {
  if (!supabase) return readProducts();
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (await attachProductRelations((data ?? []) as ProductRow[])).map((item) => normalizeProduct(item));
}

export async function adminSaveProduct(product: Product) {
  if (!supabase) {
    const items = readProducts();
    const exists = items.some((item) => item.id === product.id);
    const next = exists ? items.map((item) => item.id === product.id ? product : item) : [product, ...items];
    writeProducts(next);
    return product;
  }
  const { images, category, ...payload } = product;
  const { error } = await supabase.from('products').upsert(payload);
  if (error) throw error;
  await supabase.from('product_images').delete().eq('product_id', product.id);
  if (images.length) {
    const { error: imageError } = await supabase.from('product_images').insert(images.map((image_url, sort_order) => ({ product_id: product.id, image_url, sort_order })));
    if (imageError) throw imageError;
  }
  return product;
}

export async function adminDeleteProduct(id: string) {
  if (!supabase) {
    writeProducts(readProducts().filter((item) => item.id !== id));
    return;
  }
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function adminListCategories() {
  if (!supabase) return readCategories();
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data as Category[];
}

export async function adminSaveCategory(category: Category) {
  if (!supabase) {
    const items = readCategories();
    const exists = items.some((item) => item.id === category.id);
    writeCategories(exists ? items.map((item) => item.id === category.id ? category : item) : [category, ...items]);
    return category;
  }
  const { error } = await supabase.from('categories').upsert(category);
  if (error) throw error;
  return category;
}

export async function adminDeleteCategory(id: string) {
  if (!supabase) {
    writeCategories(readCategories().filter((item) => item.id !== id));
    return;
  }
  const { count, error: countError } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('category_id', id);
  if (countError) throw countError;
  if ((count ?? 0) > 0) throw new Error('Move or delete products in this category before deleting it.');
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

async function compressImage(file: File): Promise<File> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Unable to read image.'));
      img.src = imageUrl;
    });

    const maxSide = 1400;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.78));
    if (!blob || blob.size >= file.size) return file;

    const safeName = file.name.replace(/\.[^.]+$/, '') || 'product-image';
    return new File([blob], `${safeName}.webp`, { type: 'image/webp', lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export async function uploadProductImages(files: File[]) {
  const validFiles = files.filter((file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);
  if (validFiles.length !== files.length) throw new Error('Images must be valid image files up to 10MB each.');

  const compressedFiles = await Promise.all(validFiles.map((file) => compressImage(file)));
  if (!supabase) return compressedFiles.map((file) => URL.createObjectURL(file));

  const urls: string[] = [];
  for (const file of compressedFiles) {
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export async function importStarterCatalog() {
  if (!hasSupabaseConfig || !supabase) {
    writeCategories(starterCategories);
    writeProducts(starterProducts);
    return { products: starterProducts.length, categories: starterCategories.length };
  }

  const { error: categoryError } = await supabase.from('categories').upsert(starterCategories, { onConflict: 'id' });
  if (categoryError) throw categoryError;

  for (const product of starterProducts) {
    await adminSaveProduct(product);
  }

  return { products: starterProducts.length, categories: starterCategories.length };
}
