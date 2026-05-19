import React, { useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './SEO';
import CookieBanner from './CookieBanner';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

export default function SiteLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <ScrollToTop />
      <SEO />
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          id="main-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
      <CookieBanner />

      {/* Sticky mobile CTA */}
      {!isHome && (
        <Link
          to="/book"
          className="lg:hidden fixed bottom-5 right-5 z-40 h-12 px-5 rounded-full bg-brand text-white font-semibold text-sm shadow-glow flex items-center gap-2 active:scale-95 transition"
        >
          <Wrench size={16} />
          Book Repair
        </Link>
      )}
    </div>
  );
}
