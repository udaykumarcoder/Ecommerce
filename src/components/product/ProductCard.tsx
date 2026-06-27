import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export function ProductCard({ product }: { product: Product }) {
  const price = product.discount_price ?? product.price;
  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <Link to={`/product/${product.slug}`} aria-label={`View ${product.title}`}>
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.images[0]} alt={product.title} loading="lazy" />
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">{product.category?.name}</p>
          <Link to={`/product/${product.slug}`} className="mt-1 block font-semibold text-slate-950 hover:text-teal-700 dark:text-white dark:hover:text-teal-300">
            {product.title}
          </Link>
        </div>
       <div className="space-y-1">
  <div className="flex items-center gap-2">
    <span className="font-bold text-slate-950 dark:text-white">
      {formatPrice(price)}
    </span>

    {product.discount_price && (
      <span className="text-sm text-slate-400 line-through">
        {formatPrice(product.price)}
      </span>
    )}
  </div>

  <span
    className={`text-sm font-medium ${
      product.stock > 0 ? "text-emerald-600" : "text-rose-600"
    }`}
  >
    {product.stock > 0 ? "In Stock" : "Out of Stock"}
  </span>
</div>
        <a
          className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-teal-200"
          href={buildWhatsAppUrl(product, 1, `${window.location.origin}/product/${product.slug}`)}
          target="_blank"
          rel="noreferrer"
          aria-disabled={product.stock <= 0}
        >
          <ShoppingBag size={16} aria-hidden="true" />
          Buy
        </a>
      </div>
    </article>
  );
}
