import { Boxes, FolderTree, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Seo } from '../../components/common/Seo';
import { adminListCategories, adminListProducts } from '../../services/adminCatalog';
import type { Category, Product } from '../../types';
import { formatPrice } from '../../utils/format';

export function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([adminListProducts(), adminListCategories()]).then(([productData, categoryData]) => {
      setProducts(productData);
      setCategories(categoryData);
    });
  }, []);

  const cards = [
    { label: 'Total products', value: products.length, icon: Boxes },
    { label: 'Total categories', value: categories.length, icon: FolderTree },
    { label: 'Featured products', value: products.filter((product) => product.featured).length, icon: Star },
  ];

  return (
    <>
      <Seo title="Admin Dashboard | SaifElectronics" description="SaifElectronics admin dashboard." />
      <div className="mb-6"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-slate-500">Catalog snapshot and latest products.</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><Icon className="text-teal-600" size={22} aria-hidden="true" /><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-black">{value}</p></div>)}
      </div>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800"><h2 className="font-bold">Latest products</h2></div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {products.slice(0, 5).map((product) => <div key={product.id} className="flex items-center justify-between gap-4 p-4"><div><p className="font-semibold">{product.title}</p><p className="text-sm text-slate-500">{product.sku}</p></div><p className="font-semibold">{formatPrice(product.discount_price ?? product.price)}</p></div>)}
        </div>
      </div>
    </>
  );
}
