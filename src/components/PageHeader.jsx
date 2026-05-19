import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative pt-32 lg:pt-40 pb-14 lg:pb-20 bg-gradient-to-b from-ink-50 to-white overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px] opacity-60 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.18), transparent 60%)',
        }}
      />
      <div className="relative container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <span className="section-eyebrow inline-flex items-center gap-2 mb-4">
              <span className="inline-block w-6 h-px bg-accent-500" />
              {eyebrow}
            </span>
          )}
          <h1 className="text-display-lg text-ink-950 tracking-tight text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink-600 max-w-2xl text-pretty">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
