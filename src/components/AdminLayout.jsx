import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminLayout() {
  const { profile, user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const initial = (profile?.full_name || user?.email || 'A').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Topbar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-b border-ink-100">
        <div className="h-16 flex items-center justify-between px-5 lg:pl-72 lg:pr-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden grid place-items-center w-10 h-10 rounded-full bg-ink-50 text-ink-950"
              aria-label="Open admin menu"
            >
              <Menu size={20}/>
            </button>
            <p className="text-sm text-ink-500 hidden sm:block">
              <span className="text-ink-950 font-semibold">Admin</span> ·{' '}
              <span className="capitalize">{location.pathname.split('/')[2] || 'dashboard'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 hover:text-ink-950 transition">
              <ExternalLink size={13}/> View site
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-ink-100">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-accent-700 grid place-items-center text-white text-xs font-bold">
                {initial}
              </span>
              <div className="hidden sm:block leading-tight">
                <p className="text-xs font-semibold text-ink-950 truncate max-w-[140px]">{profile?.full_name || 'Admin'}</p>
                <p className="text-[10px] text-ink-500 truncate max-w-[140px]">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-ink-950 text-white flex-col z-30">
        <Link to="/" className="flex items-center gap-2.5 px-6 h-16 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-accent-700 grid place-items-center shadow-glow-sm">
            <ShieldCheck size={18} className="text-white"/>
          </div>
          <div className="leading-none">
            <p className="font-bold text-[15px]">Spider Mobiles</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">Admin</p>
          </div>
        </Link>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner'
                      : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={17}/>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut size={17}/>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div className="lg:hidden fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute top-0 left-0 bottom-0 w-72 bg-ink-950 text-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-accent-700 grid place-items-center">
                    <ShieldCheck size={18}/>
                  </div>
                  <div className="leading-none">
                    <p className="font-bold text-[15px]">Admin</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">Spider Mobiles</p>
                  </div>
                </Link>
                <button onClick={() => setOpen(false)} className="grid place-items-center w-9 h-9 rounded-full bg-white/10" aria-label="Close menu">
                  <X size={18}/>
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {nav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium ${
                          isActive ? 'bg-white/10 text-white' : 'text-white/70'
                        }`
                      }
                    >
                      <span className="flex items-center gap-3"><Icon size={17}/>{item.label}</span>
                      <ChevronRight size={15} className="opacity-50" />
                    </NavLink>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/10 space-y-1">
                <Link to="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/70 hover:text-white">
                  <ExternalLink size={15}/> View site
                </Link>
                <button onClick={async () => { await signOut(); navigate('/'); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-300 hover:text-red-200">
                  <LogOut size={15}/> Sign out
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="lg:pl-64 pt-16">
        <div className="p-5 sm:p-8 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
