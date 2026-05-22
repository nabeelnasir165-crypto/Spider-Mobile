import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Plausible-compatible analytics scaffold. Activates only when
// VITE_ANALYTICS_DOMAIN is set in the build env (and optionally
// VITE_ANALYTICS_SRC for a self-hosted endpoint). Zero impact when unset.
const DOMAIN = import.meta.env.VITE_ANALYTICS_DOMAIN;
const SRC    = import.meta.env.VITE_ANALYTICS_SRC || 'https://plausible.io/js/script.js';

export default function Analytics() {
  const { pathname } = useLocation();

  // Inject the script tag once on mount.
  useEffect(() => {
    if (!DOMAIN) return;
    if (document.querySelector('script[data-plausible="injected"]')) return;
    const s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', DOMAIN);
    s.setAttribute('data-plausible', 'injected');
    s.src = SRC;
    document.head.appendChild(s);
  }, []);

  // SPA pageview pings — Plausible's manual API. Fires on every route change.
  useEffect(() => {
    if (!DOMAIN || !window.plausible) return;
    window.plausible('pageview');
  }, [pathname]);

  return null;
}
