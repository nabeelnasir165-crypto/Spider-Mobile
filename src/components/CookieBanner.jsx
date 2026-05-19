import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const KEY = 'sm_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem(KEY)) setVisible(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, 'accepted');
    setVisible(false);
  };
  const decline = () => {
    localStorage.setItem(KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed bottom-4 inset-x-4 lg:left-auto lg:right-6 lg:bottom-6 lg:max-w-md z-[55]"
        >
          <div className="relative rounded-2xl bg-ink-950 text-white shadow-soft-lg border border-white/10 p-5 lg:p-6">
            <button
              onClick={decline}
              aria-label="Decline cookies"
              className="absolute top-3 right-3 w-8 h-8 rounded-full grid place-items-center text-white/60 hover:text-white hover:bg-white/10 transition"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand/20 text-brand-light grid place-items-center shrink-0">
                <Cookie size={20} />
              </div>
              <div>
                <p className="font-semibold mb-1">We use cookies</p>
                <p className="text-sm text-white/70 leading-relaxed">
                  We use essential cookies to run this site and optional analytics to help us improve it.
                  See our <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={decline} className="flex-1 h-10 rounded-full border border-white/20 text-sm font-medium hover:bg-white/10 transition">
                Decline
              </button>
              <button onClick={accept} className="flex-1 h-10 rounded-full bg-brand hover:bg-brand-dark text-sm font-semibold transition">
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
