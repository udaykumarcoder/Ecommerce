// import { BarChart3, Boxes, FolderTree, LogOut, PlusCircle, Settings } from 'lucide-react';
// import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const links = [
//   { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
//   { to: '/admin/products', label: 'Products', icon: Boxes },
//   { to: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
//   { to: '/admin/categories', label: 'Categories', icon: FolderTree },
//   { to: '/admin/settings', label: 'Settings', icon: Settings },
// ];

// export function AdminLayout() {
//   const { signOut, user } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
//       <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
//         <aside className="border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:border-b-0 lg:border-r">
//           <div className="mb-6">
//             <p className="text-lg font-bold">SaifElectronics</p>
//             <p className="mt-1 text-xs text-slate-500">Admin panel</p>
//           </div>
//           <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Admin navigation">
//             {links.map(({ to, label, icon: Icon, end }) => (
//               <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
//                 <Icon size={17} aria-hidden="true" />
//                 {label}
//               </NavLink>
//             ))}
//           </nav>
//           <button onClick={async () => { await signOut(); navigate('/admin/login'); }} className="mt-6 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
//             <LogOut size={17} aria-hidden="true" />
//             Logout
//           </button>
//           <p className="mt-4 text-xs text-slate-500">{user?.email}</p>
//         </aside>
//         <main className="p-4 sm:p-6 lg:p-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
import {
  BarChart3,
  Boxes,
  FolderTree,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const links = [
  { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/products/new", label: "Add Product", icon: PlusCircle },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
        <h1 className="font-bold text-lg">SaifElectronics</h1>

        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        {/* Mobile Overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">SaifElectronics</p>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>

            <button
              className="lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={async () => {
              await signOut();
              navigate("/admin/login");
            }}
            className="mt-6 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <LogOut size={17} />
            Logout
          </button>

          <p className="mt-4 break-all text-xs text-slate-500">
            {user?.email}
          </p>
        </aside>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}