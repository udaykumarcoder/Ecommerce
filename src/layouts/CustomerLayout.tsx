import { Moon, Search, ShoppingBag, Sun } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { DubaiNotice } from '../components/common/DubaiNotice';
import { useTheme } from '../contexts/ThemeContext';
import { env } from '../lib/env';

export function CustomerLayout() {
  const { dark, toggleTheme } = useTheme();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200' : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <DubaiNotice />
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-600 text-white">
              <ShoppingBag size={18} aria-hidden="true" />
            </span>
            SaifElectronics
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/products" className={linkClass}>Products</NavLink>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/products" className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Search products">
              <Search size={18} aria-hidden="true" />
            </Link>
            {/* <button onClick={toggleTheme} className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle dark mode">
              {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button> */}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="font-bold">SaifElectronics</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Dubai-only WhatsApp ordering for electronics, baby tech, and practical home devices.</p>
          </div>
          <div>
            <p className="font-semibold">Order</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">WhatsApp: {env.whatsappNumber ?? 'Configure VITE_WHATSAPP_NUMBER'}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Delivery area: Dubai</p>
          </div>
          <div>
            <p className="font-semibold">Links</p>
            <div className="mt-2 flex gap-4 text-sm text-slate-600 dark:text-slate-300">
              <Link to="/products">Products</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


