import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'Spider Mobiles Derby';

// LocalBusiness structured data — Google rich-results for the Derby store.
// Sites only need to inject this once on the page (we use a script with a
// stable id and replace its contents on each navigation).
const LOCAL_BUSINESS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'MobilePhoneStore',
  '@id': 'https://spidermobiles.co.uk#store',
  name: 'Spider Mobiles Derby',
  image: 'https://spidermobiles.co.uk/og-image.png',
  url: 'https://spidermobiles.co.uk',
  telephone: '+44 1332 986446',
  priceRange: '££',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '835 Osmaston Road',
    addressLocality: 'Derby',
    postalCode: 'DE24 8EX',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.8959,
    longitude: -1.4634,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '17:00' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1247',
    bestRating: '5',
    worstRating: '1',
  },
  areaServed: { '@type': 'City', name: 'Derby' },
  sameAs: [],
};
const META = {
  '/': {
    title: 'Spider Mobiles Derby — Fast, Trusted Phone Repairs',
    description: 'Derby\'s most-trusted mobile repair specialists. Same-day phone, tablet and watch repairs backed by a 12-month warranty.',
  },
  '/repairs': {
    title: `Phone Repairs in Derby · ${SITE}`,
    description: 'Premium phone, tablet and watch repairs. Same-day fixes, OEM-grade parts, 12-month warranty.',
  },
  '/refurbished': {
    title: `Refurbished Phones · ${SITE}`,
    description: 'Certified pre-owned iPhone, Samsung, Pixel and OnePlus. Save up to 50% with a 12-month warranty.',
  },
  '/accessories': {
    title: `Accessories · ${SITE}`,
    description: 'Cases, chargers, screen protectors, power banks and audio devices. Fitted in-store, free.',
  },
  '/track': {
    title: `Track Your Repair · ${SITE}`,
    description: 'Live status updates on your repair. Enter your repair ID or mobile number to track.',
  },
  '/about': {
    title: `About · ${SITE}`,
    description: 'Ten years of Derby\'s most-loved phone repair specialists. Our story, team and warranty promise.',
  },
  '/contact': {
    title: `Contact · ${SITE}`,
    description: 'Visit our Derby store or send us a message — we reply within the hour, Mon–Sat.',
  },
  '/login': { title: `Sign in · ${SITE}`, description: 'Sign in to track your repairs and manage bookings.' },
  '/signup': { title: `Create account · ${SITE}`, description: 'Create a free account to book and track phone repairs.' },
  '/account': { title: `Your account · ${SITE}`, description: 'Manage bookings, repairs and your profile.' },
  '/book': { title: `Book a repair · ${SITE}`, description: 'Book your repair in 5 quick steps. Most fixes ready in 30–60 minutes.' },
  '/cart': { title: `Your bag · ${SITE}`, description: 'Review items before checkout.' },
  '/checkout': { title: `Checkout · ${SITE}`, description: 'Secure checkout — card, Apple Pay, Google Pay, or cash on collection.' },
  '/forgot-password': { title: `Forgot password · ${SITE}`, description: 'Reset your password.' },
  '/reset-password': { title: `Reset password · ${SITE}`, description: 'Choose a new password.' },
  '/privacy': {
    title: `Privacy Policy · ${SITE}`,
    description: 'How we handle your data — clear, honest, GDPR-compliant.',
  },
  '/terms': {
    title: `Terms of Service · ${SITE}`,
    description: 'The terms covering repairs, refurbished sales and accessories.',
  },
};

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = META[pathname] || META['/'];
    document.title = meta.title;

    const setMeta = (attr, name, value) => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('name', 'description', meta.description);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:type', pathname === '/' ? 'website' : 'article');
    setMeta('property', 'og:site_name', SITE);
    setMeta('property', 'og:url', `https://spidermobiles.co.uk${pathname}`);
    setMeta('property', 'og:image', 'https://spidermobiles.co.uk/og-image.png');
    setMeta('property', 'og:image:type', 'image/png');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:alt', 'Spider Mobiles Derby — fast, trusted phone repairs');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    setMeta('name', 'twitter:image', 'https://spidermobiles.co.uk/og-image.png');
    setMeta('name', 'theme-color', '#0EA5E9');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://spidermobiles.co.uk${pathname}`);

    // LocalBusiness structured data (Google rich results). Stays the same
    // across pages so we just upsert it once.
    let ld = document.getElementById('ld-localbusiness');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'ld-localbusiness';
      ld.type = 'application/ld+json';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(LOCAL_BUSINESS_JSONLD);
  }, [pathname]);

  return null;
}
