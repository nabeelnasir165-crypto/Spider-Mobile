import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// Map URL segments to human labels. Anything not listed falls back to a
// titlecased version of the segment so dynamic routes still read OK.
const LABELS = {
  repairs: 'Repairs',
  refurbished: 'Refurbished',
  accessories: 'Accessories',
  track: 'Track Repair',
  about: 'About',
  contact: 'Contact',
  privacy: 'Privacy',
  terms: 'Terms',
  login: 'Sign in',
  signup: 'Create account',
  'forgot-password': 'Forgot password',
  'reset-password': 'Reset password',
  account: 'Account',
  book: 'Book a Repair',
  cart: 'Your bag',
  checkout: 'Checkout',
  order: 'Order',
};

const titlecase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Hide on the homepage and on auth screens where the form IS the whole page.
const HIDDEN_PREFIXES = ['/login', '/signup', '/forgot-password', '/reset-password'];

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  const crumbs = useMemo(() => {
    if (pathname === '/') return null;
    if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

    const parts = pathname.split('/').filter(Boolean);
    return parts.map((seg, i) => ({
      label: LABELS[seg] || titlecase(decodeURIComponent(seg)),
      href: '/' + parts.slice(0, i + 1).join('/'),
      isLast: i === parts.length - 1,
    }));
  }, [pathname]);

  if (!crumbs) return null;

  // JSON-LD structured breadcrumb for SEO rich results.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://spidermobiles.co.uk/' },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.label,
        item: `https://spidermobiles.co.uk${c.href}`,
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className="container-page pt-20 lg:pt-24 pb-1">
      <ol className="flex items-center flex-wrap gap-1.5 text-[12px] text-ink-500">
        <li className="flex items-center">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-ink-950 transition" aria-label="Home">
            <Home size={12} aria-hidden="true"/> Home
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.href} className="flex items-center gap-1.5">
            <ChevronRight size={12} aria-hidden="true" className="text-ink-300"/>
            {c.isLast ? (
              <span aria-current="page" className="font-medium text-ink-700 truncate max-w-[200px]">{c.label}</span>
            ) : (
              <Link to={c.href} className="hover:text-ink-950 transition truncate max-w-[160px]">{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}
