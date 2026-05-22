import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight, ShieldCheck, Clock, BadgeCheck } from 'lucide-react';

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21.5v-8h2.7l.4-3.1h-3.1V8.4c0-.9.25-1.5 1.55-1.5h1.65V4.1c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.11v2.3H7.6v3.1h2.7v8h3.2Z"/>
  </svg>
);
const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 3H21.5l-7.5 8.57L22.5 21h-6.8l-5.32-6.31L4.2 21H.94l8.02-9.17L0 3h6.94l4.8 5.78L18.244 3Zm-2.39 16.07h1.78L7.06 4.84H5.16l10.69 14.23Z"/>
  </svg>
);

const links = {
  Shop: [
    { label: 'Refurbished Phones', to: '/refurbished' },
    { label: 'Accessories', to: '/accessories' },
    { label: 'Cases', to: '/accessories?category=cases' },
    { label: 'Chargers', to: '/accessories?category=chargers' },
  ],
  Services: [
    { label: 'Phone Repair', to: '/repairs' },
    { label: 'Instant Quote', to: '/repairs#quote' },
    { label: 'Track Repair', to: '/track' },
    { label: 'Warranty', to: '/about#warranty' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Reviews', to: '/about#reviews' },
    { label: 'Find Us', to: '/contact#map' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Warranty Info', to: '/about#warranty' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-ink-950 text-white overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 0%, rgba(14,165,233,0.25), transparent 45%), radial-gradient(circle at 88% 100%, rgba(14,165,233,0.18), transparent 55%)',
        }}
      />
      <div className="relative container-page pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            { Icon: ShieldCheck, title: '12-Month Warranty', sub: 'On every repair and refurb.' },
            { Icon: Clock, title: 'Same-Day Repair', sub: 'Most fixes ready within hours.' },
            { Icon: BadgeCheck, title: 'Certified Technicians', sub: 'Trusted by 12,000+ customers.' },
          ].map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-brand/20 grid place-items-center text-brand-light shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-white/60">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          <div className="col-span-2 max-w-sm">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-accent-700 grid place-items-center shadow-glow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="2" width="12" height="20" rx="2.5" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <div className="leading-none">
                <p className="font-bold text-[15px]">Spider Mobiles</p>
                <p className="text-[10px] tracking-[0.18em] uppercase text-white/50">Derby · UK</p>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Derby&rsquo;s most-trusted mobile repair specialists. Fast, certified, and warranty-backed — for phones, tablets and accessories.
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: InstagramIcon, label: 'Instagram (coming soon)' },
                { Icon: FacebookIcon,  label: 'Facebook (coming soon)' },
                { Icon: TwitterIcon,   label: 'X / Twitter (coming soon)' },
              ].map(({ Icon, label }, i) => (
                <span
                  key={i}
                  title={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full grid place-items-center bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                >
                  <Icon width={16} height={16} aria-hidden="true" />
                </span>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50 mb-4">{title}</p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-white/75 hover:text-white inline-flex items-center gap-1.5 group"
                    >
                      {item.label}
                      <ChevronRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2"><MapPin size={14} className="text-brand-light"/> 835 Osmaston Road, Derby</div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-brand-light"/> <a href="tel:+441332986446" className="hover:text-white transition">01332 986446</a></div>
            <div className="flex items-center gap-2"><Mail size={14} className="text-brand-light"/> hello@spidermobiles.co.uk</div>
          </div>
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} Spider Mobiles Derby. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
