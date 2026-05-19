import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AuthCard({ eyebrow, title, subtitle, children, altLink }) {
  return (
    <section className="relative min-h-screen pt-24 lg:pt-28 pb-16 flex items-center bg-gradient-to-b from-ink-50 to-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px] opacity-60 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.18), transparent 60%)' }}
      />
      <div className="relative container-page w-full">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl bg-white border border-ink-100 shadow-soft-lg p-7 lg:p-9"
          >
            {eyebrow && <span className="section-eyebrow inline-block mb-3">{eyebrow}</span>}
            <h1 className="text-2xl lg:text-3xl font-bold text-ink-950 tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-ink-600 leading-relaxed">{subtitle}</p>}

            <div className="mt-7">{children}</div>

            {altLink && (
              <p className="mt-7 pt-6 border-t border-ink-100 text-center text-sm text-ink-600">
                {altLink.label}{' '}
                <Link to={altLink.to} className="font-semibold text-ink-950 hover:text-brand transition">
                  {altLink.cta}
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
