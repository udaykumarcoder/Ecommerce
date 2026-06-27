export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  created_at?: string;
  updated_at?: string;
};

export type ProductStatus = 'active' | 'draft';

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string;
  category?: Category;
  price: number;
  discount_price?: number | null;
  stock: number;
  sku: string;
  featured: boolean;
  new_arrival: boolean;
  best_seller: boolean;
  status: ProductStatus;
  images: string[];
  specifications: Record<string, string>;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
};
