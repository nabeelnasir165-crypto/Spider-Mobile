import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';

const navItems = [
  { label: 'Repairs', to: '/repairs' },
  { label: 'Refurbished', to: '/refurbished' },
  { label: 'Accessories', to: '/accessories' },
  { label: 'Track Repair', to: '/track' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Logo = ({ light = false }) => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-accent-700 grid place-items-center shadow-glow-sm group-hover:scale-105 transition-transform">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="2.5" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className={`font-bold tracking-tight text-[15px] ${light ? 'text-white' : 'text-ink-950'}`}>Spider Mobiles</span>
      <span className={`text-[10px] font-medium tracking-[0.18em] uppercase ${light ? 'text-white/60' : 'text-ink-500'}`}>Derby · UK</span>
    </div>
  </Link>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-ink-100 shadow-soft'
            : 'bg-transparent border-b border-transparent'
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
            <a href="tel:+441332000000" className="btn-ghost h-10 px-4 text-[13px]">
              <Phone size={15} />
              <span>01332 000 000</span>
            </a>
            <Link to="/repairs" className="btn-accent h-10 px-5 text-[13px]">
              Book Repair
              <ChevronRight size={15} />
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden grid place-items-center w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-ink-200 text-ink-950 hover:bg-white transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-ink-950/60 backdrop-blur"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute top-0 right-0 bottom-0 w-[88%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-ink-100">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  className="grid place-items-center w-10 h-10 rounded-full bg-ink-50 text-ink-950 hover:bg-ink-100"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold ${
                          isActive ? 'bg-ink-950 text-white' : 'text-ink-900 hover:bg-ink-50'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={18} className="opacity-60" />
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              <div className="p-5 border-t border-ink-100 flex flex-col gap-2.5">
                <a href="tel:+441332000000" className="btn-outline w-full">
                  <Phone size={16} />
                  01332 000 000
                </a>
                <Link to="/repairs" className="btn-accent w-full">
                  Book Repair Now
                  <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
