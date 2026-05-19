import React from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone, BatteryCharging, Plug, Camera, Droplets, Volume2, TerminalSquare, Tablet, ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../data/repairs';
import { SectionHeader, Reveal } from '../components/Section';

const iconMap = {
  Smartphone, BatteryCharging, Plug, Camera, Droplets, Volume2, TerminalSquare, Tablet,
};

export default function ServicesGrid() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow="Repair Services"
          title="Anything that&rsquo;s broken, we fix — fast."
          subtitle="From cracked screens to water rescue, every service is performed by certified technicians using OEM-grade parts."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Smartphone;
            return (
              <Reveal key={s.title} delay={i * 0.05}>
                <Link
                  to="/repairs"
                  className="group relative h-full p-6 rounded-2xl bg-white border border-ink-100 hover:border-ink-300 hover:shadow-soft-lg transition-all duration-300 flex flex-col"
                >
                  {s.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-accent-100 text-accent-700">
                      {s.badge}
                    </span>
                  )}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="w-12 h-12 rounded-xl bg-ink-950 grid place-items-center text-white mb-5 group-hover:bg-brand transition-colors"
                  >
                    <Icon size={22} />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-ink-950 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-ink-600 leading-relaxed flex-1">{s.desc}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-ink-500">From <span className="font-bold text-ink-950">£{s.from}</span></span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
                      Book <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
