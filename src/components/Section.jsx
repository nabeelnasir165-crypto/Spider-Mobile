import React from 'react';
import { motion } from 'framer-motion';

export function Reveal({ children, delay = 0, y = 24, className = '', once = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'left', dark = false }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <Reveal className={`max-w-3xl mb-12 lg:mb-16 ${alignCls}`}>
      {eyebrow && (
        <span className={`section-eyebrow inline-flex items-center gap-2 mb-4 ${dark ? 'text-brand-light' : ''}`}>
          <span className={`inline-block w-6 h-px ${dark ? 'bg-brand-light' : 'bg-accent-500'}`} />
          {eyebrow}
        </span>
      )}
      <h2 className={`text-display-md ${dark ? 'text-white' : 'text-ink-950'} text-balance`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base sm:text-lg leading-relaxed text-pretty ${dark ? 'text-white/65' : 'text-ink-600'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
