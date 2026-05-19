import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, ChevronRight, Phone } from 'lucide-react';
import { Reveal } from '../components/Section';

export default function FinalCTA() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-ink-950 via-ink-900 to-accent-950 p-10 sm:p-14 lg:p-20 text-white">
            <motion.div
              aria-hidden
              className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-brand/30 blur-[120px]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              aria-hidden
              className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full bg-accent-600/20 blur-[120px]"
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            <div className="relative max-w-3xl">
              <span className="section-eyebrow text-brand-light mb-4 inline-block">Visit us today</span>
              <h2 className="text-display-md text-balance">
                Drop in, drop off, or book online — your phone&rsquo;s ready in 30 minutes.
              </h2>
              <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
                Walk-ins welcome at our Derby store. Or get a quote online and we&rsquo;ll have your repair
                started before you even arrive.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/book" className="btn-accent">
                  <Wrench size={16}/> Book a Repair
                </Link>
                <a href="tel:+441332000000" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 text-white font-medium text-sm transition">
                  <Phone size={16}/> 01332 000 000
                </a>
                <Link to="/contact" className="inline-flex items-center gap-2 h-12 px-6 text-white/85 hover:text-white text-sm font-medium transition">
                  Find our store <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
