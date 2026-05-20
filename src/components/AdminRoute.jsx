import React from 'react';
import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { Loader2, ShieldX, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// In local dev (`VITE_BUILD_TARGET` unset → 'all') we skip the auth gate so the
// dashboard opens immediately. The strict gate runs for the dedicated admin
// build that ships to `admin.spidermobiles.co.uk`.
const TARGET = import.meta.env.VITE_BUILD_TARGET || 'all';
const ENFORCE_AUTH = TARGET === 'admin' || import.meta.env.VITE_ENFORCE_ADMIN_AUTH === 'true';

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (!ENFORCE_AUTH) {
    return children ? children : <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <div className="flex flex-col items-center gap-3 text-ink-500">
          <Loader2 className="animate-spin" size={28}/>
          <p className="text-sm">Checking your access…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <section className="min-h-[80vh] pt-32 lg:pt-40 pb-20 grid place-items-center bg-gradient-to-b from-ink-50 to-white">
        <div className="container-page max-w-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 grid place-items-center mx-auto mb-6">
            <ShieldX size={28} />
          </div>
          <h1 className="text-3xl font-bold text-ink-950 mb-3">Admin access required</h1>
          <p className="text-ink-600 leading-relaxed mb-8">
            This area is restricted to Spider Mobiles staff. If you should have access, ask an
            administrator to grant you the admin role in Supabase.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="btn-accent">
              <Home size={16}/> Back home
            </Link>
            <Link to="/account" className="btn-outline">
              Go to your account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return children ? children : <Outlet />;
}
