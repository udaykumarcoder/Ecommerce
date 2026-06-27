import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center text-slate-500">Checking admin access...</div>;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return <Outlet />;
}
