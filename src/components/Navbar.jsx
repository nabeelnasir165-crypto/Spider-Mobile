import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronRight, User, LogOut, Smartphone, Plus, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const navItems = [
  { label: 'Repairs', to: '/repairs' },
  { label: 'Refurbished', to: '/refurbished' },
  { label: 'Accessories', to: '/accessories' },
  { label: 'Track Repair', to: '/track' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-accent-700 grid place-items-center shadow-glow-sm group-hover:scale-105 transition-transform">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="2.5" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-bold tracking-tight text-[15px] text-ink-950">Spider Mobiles</span>
      <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-ink-500">Derby · UK</span>
    </div>
  </Link>
);

function UserPill() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  if (!user) {
    return (
      <>
        <Link to="/login" className="btn-ghost h-10 px-4 text-[13px]">
          Sign in
        </Link>
        <Link to="/signup" className="btn-accent h-10 px-4 text-[13px]">
          Create account
        </Link>
      </>
    );
  }

  const initial = (profile?.full_name || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2.5 h-10 pl-1.5 pr-3 rounded-full bg-white/80 backdrop-blur border border-ink-200 hover:bg-white transition"
      >
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-accent-700 grid place-items-center text-white text-xs font-bold">
          {initial}
        </span>
        <span className="text-sm font-medium text-ink-900 max-w-[120px] truncate">
          {profile?.full_name?.split(' ')[0] || 'Account'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-ink-100 shadow-soft-lg p-2 overflow-hidden"
          >
            <div className="px-3 py-2.5 mb-1 border-b border-ink-100">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ink-950 truncate">{profile?.full_name || 'Account'}</p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent-100 text-accent-800 text-[9px] font-bold uppercase tracking-wider">
                    <ShieldCheck size={9}/> Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-500 truncate">{user.email}</p>
            </div>
            {isAdmin && (
              <MenuLink to="/admin" onClick={() => setOpen(false)} icon={ShieldCheck}>Admin dashboard</MenuLink>
            )}
            <MenuLink to="/account" onClick={() => setOpen(false)} icon={User}>My account</MenuLink>
            <MenuLink to="/book" onClick={() => setOpen(false)} icon={Plus}>New repair</MenuLink>
            <MenuLink to="/track" onClick={() => setOpen(false)} icon={Smartphone}>My bookings</MenuLink>
            <button
              onClick={async () => { setOpen(false); await signOut(); navigate('/'); }}
              className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition"
            >
              <LogOut size={15}/> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CartButton({ compact }) {
  const { count, openCart } = useCart();
  return (
    <button
      onClick={openCart}
      aria-label={count > 0 ? `Open cart, ${count} item${count === 1 ? '' : 's'}` : 'Open cart'}
      className={`relative grid place-items-center ${compact ? 'w-10 h-10' : 'w-10 h-10'} rounded-full bg-white/80 backdrop-blur border border-ink-200 text-ink-950 hover:bg-white transition`}
    >
      <ShoppingBag size={18}/>
      {count > 0 && (
        <span aria-hidden="true" className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-dark text-white text-[10px] font-bold grid place-items-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

function MenuLink({ to, onClick, icon: Icon, children }) {
  return (
    <Link to={to} onClick={onClick} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-ink-800 hover:bg-ink-50 transition flex items-center gap-2.5">
      <Icon size={15} className="text-ink-500"/>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();
  const openerRef = useRef(null);
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus trap + Escape close for the mobile drawer (WCAG 2.1.2 / 2.4.3)
  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus();  e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-ink-100 shadow-soft' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container-page h-16 lg:h-[72px] flex items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'text-ink-950' : 'text-ink-600 hover:text-ink-950'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-ink-100 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <CartButton />
            <UserPill />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <CartButton compact />
            <button
              ref={openerRef}
              onClick={() => setOpen(true)}
              className="grid place-items-center w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-ink-200 text-ink-950 hover:bg-white transition"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="lg:hidden fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-ink-950/60 backdrop-blur" onClick={() => setOpen(false)} />
            <motion.div
              ref={drawerRef}
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute top-0 right-0 bottom-0 w-[88%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-ink-100">
                <Logo />
                <button ref={closeBtnRef} onClick={() => setOpen(false)} className="grid place-items-center w-10 h-10 rounded-full bg-ink-50 text-ink-950 hover:bg-ink-100" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>

              {user && (
                <div className="px-5 py-4 border-b border-ink-100 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent-700 grid place-items-center text-white font-bold">
                    {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-950 truncate">{profile?.full_name || 'Account'}</p>
                    <p className="text-xs text-ink-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-1">
                {user && isAdmin && (
                  <NavLink to="/admin" className={({ isActive }) => `flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold ${isActive ? 'bg-ink-950 text-white' : 'bg-accent-50 text-accent-900'}`}>
                    <span className="flex items-center gap-2"><ShieldCheck size={16}/> Admin dashboard</span><ChevronRight size={18} className="opacity-60" />
                  </NavLink>
                )}
                {user && (
                  <NavLink to="/account" className={({ isActive }) => `flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold ${isActive ? 'bg-ink-950 text-white' : 'text-ink-900 hover:bg-ink-50'}`}>
                    <span>My account</span><ChevronRight size={18} className="opacity-60" />
                  </NavLink>
                )}
                {navItems.map((item, i) => (
                  <motion.div key={item.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i, duration: 0.3 }}>
                    <NavLink to={item.to} className={({ isActive }) => `flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold ${isActive ? 'bg-ink-950 text-white' : 'text-ink-900 hover:bg-ink-50'}`}>
                      <span>{item.label}</span><ChevronRight size={18} className="opacity-60" />
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div className="p-5 border-t border-ink-100 flex flex-col gap-2.5">
                {user ? (
                  <>
                    <Link to="/book" className="btn-accent w-full">
                      <Plus size={16}/> Book a repair
                    </Link>
                    <button onClick={async () => { await signOut(); setOpen(false); }} className="btn-outline w-full">
                      <LogOut size={16}/> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="btn-accent w-full">Create account <ChevronRight size={16}/></Link>
                    <Link to="/login" className="btn-outline w-full">Sign in</Link>
                  </>
                )}
                <a href="tel:+441332986446" className="inline-flex items-center justify-center gap-2 h-11 text-sm font-medium text-ink-700">
                  <Phone size={14}/> 01332 986446
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
