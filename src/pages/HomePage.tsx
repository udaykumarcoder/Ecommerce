import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/common/Seo';
import { ProductCard } from '../components/product/ProductCard';
import { useCatalog } from '../hooks/useCatalog';
import { env } from '../lib/env';
import heroBanner from '../assets/hero-banner.png';

export function HomePage() {
  const { products, categories, loading, error } = useCatalog();
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const best = products.filter((product) => product.best_seller).slice(0, 4);
  const arrivals = products.filter((product) => product.new_arrival).slice(0, 4);
  const whatsappHref = env.whatsappNumber ? `https://wa.me/${env.whatsappNumber.replace(/\D/g, '')}` : '#';

  return (
    <>
      <Seo title="SaifElectronics | Dubai Electronics Store" description="Shop baby toys, baby cameras, smart home devices, and phone accessories from SaifElectronics in Dubai." />
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">Dubai-only WhatsApp ordering</p>
            <h1 className="mt-4 text-4xl font-black tracking-normal text-slate-950 dark:text-white sm:text-5xl">SaifElectronics</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Premium everyday electronics, baby cameras, baby toys, and smart home essentials with fast WhatsApp ordering.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700">
                Shop products <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-900">
                WhatsApp us
              </a>
            </div>
          </motion.div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
          <img
            src={heroBanner}
            alt="Saif Electronics Store"
            className="h-full w-full object-cover"
          />
        </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 md:grid-cols-3 lg:px-8">
          {([
            ['Dubai orders only', Truck],
            ['WhatsApp buying', ShieldCheck],
            ['Live admin catalog', ShieldCheck],
          ] satisfies Array<[string, LucideIcon]>).map(([label, Icon]) => (
            <div key={label} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Icon size={18} className="text-teal-600" aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {error ? <CatalogMessage tone="error" message={error} /> : null}
      {!error && loading ? <CatalogMessage message="Loading catalog..." /> : null}
      {!error && !loading && products.length === 0 ? <CatalogMessage message="No products are published yet." /> : null}

      <Section title="Featured Products" products={featured} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Categories</h2>
          <Link to="/products" className="text-sm font-semibold text-teal-700 dark:text-teal-300">View all</Link>
        </div>
        {categories.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/products?category=${category.id}`} className="group overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="aspect-[5/3] overflow-hidden">
                  <img src={category.image} alt={category.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="font-semibold">{category.name}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">No categories yet.</p>}
      </section>
      <Section title="Best Selling" products={best} />
      <Section title="New Arrivals" products={arrivals} />
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">About SaifElectronics</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
            SaifElectronics is built for simple, direct ordering. Customers browse the live catalog, choose the product they want, and send the order details through WhatsApp for Dubai fulfillment.
          </p>
        </div>
      </section>
    </>
  );
}

function CatalogMessage({ message, tone }: { message: string; tone?: 'error' }) {
  return (
    <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className={tone === 'error' ? 'rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200' : 'rounded-lg border border-slate-200 bg-white p-5 text-slate-500 dark:border-slate-800 dark:bg-slate-900'}>{message}</p>
    </div>
  );
}

function Section({ title, products }: { title: string; products: ReturnType<typeof useCatalog>['products'] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
        <Link to="/products" className="text-sm font-semibold text-teal-700 dark:text-teal-300">Browse all</Link>
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
      ) : <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">No products in this section yet.</p>}
    </section>
  );
}
