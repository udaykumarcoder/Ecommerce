import { Copy, DatabaseZap, Edit, PlusCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Seo } from '../../components/common/Seo';
import { adminDeleteProduct, adminListProducts, adminSaveProduct, importStarterCatalog } from '../../services/adminCatalog';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setProducts(await adminListProducts());
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this product? It will disappear from the storefront.')) return;
    try {
      await adminDeleteProduct(id);
      toast.success('Product deleted');
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    }
  }

  async function duplicate(product: Product) {
    try {
      await adminSaveProduct({ ...product, id: crypto.randomUUID(), title: `${product.title} Copy`, slug: `${product.slug}-copy-${Date.now()}`, sku: `${product.sku}-COPY-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      toast.success('Product duplicated');
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Duplicate failed');
    }
  }

  async function toggle(product: Product) {
    try {
      await adminSaveProduct({ ...product, stock: product.stock > 0 ? 0 : 10, updated_at: new Date().toISOString() });
      toast.success('Stock updated');
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Stock update failed');
    }
  }

  async function importCatalog() {
    setImporting(true);
    try {
      const result = await importStarterCatalog();
      toast.success(`Imported ${result.products} products and ${result.categories} categories`);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  }

  return (
    <>
      <Seo title="Admin Products | SaifElectronics" description="Manage SaifElectronics products." />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Products</h1><p className="text-slate-500">Products here are the same products shown on the storefront.</p></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 font-semibold dark:border-slate-700"><RefreshCw size={18} aria-hidden="true" /> Refresh</button>
          {/* <button onClick={importCatalog} disabled={importing} className="inline-flex items-center gap-2 rounded-md border border-teal-600 px-4 py-2.5 font-semibold text-teal-700 disabled:opacity-60 dark:text-teal-300"><DatabaseZap size={18} aria-hidden="true" /> {importing ? 'Importing...' : 'Import Starter Catalog'}</button> */}
          <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 font-semibold text-white"><PlusCircle size={18} aria-hidden="true" /> Add Product</Link>
        </div>
      </div>
      {error ? <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</p> : null}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? <p className="p-8 text-center text-slate-500">Loading products...</p> : null}
        {!loading && products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-semibold">No products in Supabase yet</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Import the starter catalog or add your first product. Once products are saved here as active, they appear on the customer website immediately.</p>
            <button onClick={importCatalog} disabled={importing} className="mt-5 inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-3 font-semibold text-white disabled:opacity-60"><DatabaseZap size={18} aria-hidden="true" /> {importing ? 'Importing...' : 'Import Starter Catalog'}</button>
          </div>
        ) : null}
        {!loading && products.length > 0 ? (
          <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-slate-500 dark:bg-slate-800"><tr><th className="p-4">Product</th><th className="p-4">SKU</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{products.map((product) => <tr key={product.id}><td className="p-4"><div className="flex items-center gap-3">{product.images[0] ? <img src={product.images[0]} alt="" className="h-12 w-12 rounded-md object-cover" /> : <span className="h-12 w-12 rounded-md bg-slate-200 dark:bg-slate-800" />}<span className="font-semibold">{product.title}</span></div></td><td className="p-4">{product.sku}</td><td className="p-4">{formatPrice(product.discount_price ?? product.price)}</td><td className="p-4"><button onClick={() => toggle(product)} className={product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</button></td><td className="p-4 capitalize">{product.status}</td><td className="p-4"><div className="flex gap-2"><Link to={`/admin/products/${product.id}/edit`} className="rounded-md border border-slate-300 p-2 dark:border-slate-700" aria-label="Edit"><Edit size={16} /></Link><button onClick={() => duplicate(product)} className="rounded-md border border-slate-300 p-2 dark:border-slate-700" aria-label="Duplicate"><Copy size={16} /></button><button onClick={() => remove(product.id)} className="rounded-md border border-slate-300 p-2 text-rose-600 dark:border-slate-700" aria-label="Delete"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>
        ) : null}
      </div>
    </>
  );
}
