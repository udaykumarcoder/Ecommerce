import { categories as sampleCategories, products as sampleProducts } from '../data/sampleData';
import type { Category, Product } from '../types';

const categoryIds: Record<string, string> = {
  'baby-tech': '11111111-1111-4111-8111-111111111111',
  'baby-toys': '22222222-2222-4222-8222-222222222222',
  'smart-home': '33333333-3333-4333-8333-333333333333',
  'mobile-accessories': '44444444-4444-4444-8444-444444444444',
};

const productIds: Record<string, string> = {
  'p-001': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'p-002': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
  'p-003': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
  'p-004': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
  'p-005': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
  'p-006': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6',
};

export const starterCategories: Category[] = sampleCategories.map((category) => ({
  ...category,
  id: categoryIds[category.id] ?? category.id,
}));

export const starterProducts: Product[] = sampleProducts.map((product) => {
  const categoryId = categoryIds[product.category_id] ?? product.category_id;
  return {
    ...product,
    id: productIds[product.id] ?? product.id,
    category_id: categoryId,
    category: starterCategories.find((category) => category.id === categoryId),
  };
});
