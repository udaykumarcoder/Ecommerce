import type { Product } from '../types';
import { env } from '../lib/env';
import { formatPrice } from './format';

export function buildWhatsAppUrl(product: Product, quantity = 1, productUrl = window.location.href) {
  const number = env.whatsappNumber?.replace(/\D/g, '');
  if (!number) return '#';
  const price = product.discount_price ?? product.price;
  const message = [
    'Store Name',
    'SaifElectronics',
    '',
    'Customer wants to order:',
    '',
    'Product:',
    product.title,
    '',
    'Quantity:',
    String(quantity),
    '',
    'Price:',
    formatPrice(price),
    '',
    'Total:',
    formatPrice(price * quantity),
    '',
    'Product Link:',
    productUrl,
    '',
    'Please contact me regarding this order.',
  ].join('\n');

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
