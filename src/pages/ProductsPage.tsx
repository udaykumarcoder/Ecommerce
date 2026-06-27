import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Seo } from '../components/common/Seo';
import { ProductCard } from '../components/product/ProductCard';
import { useCatalog } from '../hooks/useCatalog';

const PAGE_SIZE = 6;

export function ProductsPage() {
  const { products, categories, loading, error } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const category = searchParams.get('category') ?? 'all';

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return products
      .filter((product) => category === 'all' || product.category_id === category)
      .filter((product) => !value || `${product.title} ${product.short_description} ${product.tags.join(' ')}`.toLowerCase().includes(value))
      .sort((a, b) => {
        if (sort === 'price-asc') return (a.discount_price ?? a.price) - (b.discount_price ?? b.price);
        if (sort === 'price-desc') return (b.discount_price ?? b.price) - (a.discount_price ?? a.price);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, category, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Seo title="Products | SaifElectronics" description="Browse SaifElectronics products with search, filters, sorting, and WhatsApp ordering." />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Search baby toys, baby cameras, smart devices, and mobile accessories.</p>
        </div>
        <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:grid-cols-[1fr_220px_180px]">
          <label className="relative">
            <span className="sr-only">Search products</span>
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-900" placeholder="Search products" />
          </label>
          <select value={category} onChange={(event) => { setSearchParams(event.target.value === 'all' ? {} : { category: event.target.value }); setPage(1); }} className="rounded-md border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900" aria-label="Filter category">
            <option value="all">All categories</option>
            {categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
          <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="rounded-md border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900" aria-label="Sort products">
            <option value="newest">Newest</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
          </select>
        </div>
        {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</p> : null}       {!error && loading ? <p className="py-10 text-center text-slate-500">Loading products...</p> : null}
        {!error && !loading && visible.length === 0 ? <p className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">No products found.</p> : null}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {pages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, index) => index + 1).map((item) => (
              <button key={item} onClick={() => setPage(item)} className={`h-10 w-10 rounded-md border text-sm font-semibold ${item === page ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`} aria-label={`Go to page ${item}`}>
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}

