import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Wrench, Search, ChevronRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative min-h-[80vh] pt-32 lg:pt-40 pb-20 overflow-hidden bg-gradient-to-b from-ink-50 to-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[480px] opacity-60 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.22), transparent 60%)' }}
      />
      <div className="relative container-page text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[120px] lg:text-[180px] font-bold leading-none tracking-tighter gradient-text">
            404
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h1 className="text-display-md text-ink-950 mt-4">
            That page took a hard knock.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-ink-600 leading-relaxed">
            We couldn&rsquo;t find the page you were looking for — but we&rsquo;re great at fixing things.
            Try one of the links below.
          </p>

          <div className="mt-9 flex flex-wrap gap-3 justify-center">
            <Link to="/" className="btn-accent">
              <Home size={16}/> Back home
            </Link>
            <Link to="/repairs" className="btn-outline">
              <Wrench size={16}/> Book a repair
            </Link>
            <Link to="/track" className="btn-outline">
              <Search size={16}/> Track a repair
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {[
              { to: '/refurbished', label: 'Refurbished Phones' },
              { to: '/accessories', label: 'Accessories' },
              { to: '/contact', label: 'Contact us' },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="p-4 rounded-xl bg-white border border-ink-100 hover:border-ink-300 hover:shadow-soft transition group flex items-center justify-between">
                <span className="text-sm font-semibold text-ink-950">{l.label}</span>
                <ChevronRight size={14} className="text-ink-400 group-hover:translate-x-1 transition" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
