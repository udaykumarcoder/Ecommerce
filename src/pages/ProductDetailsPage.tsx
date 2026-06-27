import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '../components/common/Seo';
import { getProductBySlug } from '../services/catalog';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    getProductBySlug(id).then(setProduct).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">Loading product...</div>;
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-xl font-semibold">Product not found</p>
        <Link to="/products" className="mt-4 inline-flex rounded-md bg-teal-600 px-4 py-2 text-white">Back to products</Link>
      </div>
    );
  }

  const price = product.discount_price ?? product.price;

  return (
    <>
      <Seo title={`${product.seo_title ?? product.title} | SaifElectronics`} description={product.seo_description ?? product.short_description} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
            <img src={product.images[image]} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((item, index) => (
              <button key={item} onClick={() => setImage(index)} className={`aspect-square overflow-hidden rounded-md border ${index === image ? 'border-teal-600' : 'border-slate-200 dark:border-slate-800'}`} aria-label={`View image ${index + 1}`}>
                <img src={item} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">{product.category?.name}</p>
          <h1 className="mt-3 text-3xl font-bold">{product.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-black">{formatPrice(price)}</span>
            {product.discount_price ? <span className="text-lg text-slate-400 line-through">{formatPrice(product.price)}</span> : null}
          </div>
          <p className={product.stock > 0 ? 'mt-3 font-semibold text-emerald-600' : 'mt-3 font-semibold text-rose-600'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center overflow-hidden rounded-md border border-slate-300 dark:border-slate-700">
              <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                <Minus size={16} aria-hidden="true" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))} aria-label="Increase quantity">
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
          <a href={buildWhatsAppUrl(product, quantity)} target="_blank" rel="noreferrer" aria-disabled={product.stock <= 0} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700 aria-disabled:pointer-events-none aria-disabled:opacity-50 sm:w-auto">
            <ShoppingBag size={18} aria-hidden="true" />
            Buy Now
          </a>
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="font-bold">Specifications</h2>
            <dl className="mt-4 grid gap-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b border-slate-100 pb-2 text-sm last:border-0 dark:border-slate-800">
                  <dt className="text-slate-500">{key}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
