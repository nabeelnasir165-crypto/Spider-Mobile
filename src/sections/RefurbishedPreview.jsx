import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Recycle, Truck } from 'lucide-react';
import { phones } from '../data/products';
import { SectionHeader, Reveal } from '../components/Section';

export default function RefurbishedPreview() {
  const featured = phones.slice(0, 4);
  return (
    <section className="py-24 lg:py-32 bg-ink-50">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Refurbished Phones"
            title="Like-new. Half the price. Fully warrantied."
            subtitle="Every device is professionally inspected, sanitised and certified across 40+ points. Save up to 50% with our 12-month warranty."
          />
          <Reveal delay={0.1}>
            <Link to="/refurbished" className="btn-outline shrink-0">
              View all phones <ChevronRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <Link to={`/refurbished#${p.id}`} className="block group">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-ink-100 mb-4 bg-white">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${p.accent}22, ${p.accent}66)`,
                    }}
                  />
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="pill-accent text-[10px]">
                      <ShieldCheck size={11} /> {p.warranty}mo warranty
                    </span>
                    <span className="pill text-[10px] bg-white/80 backdrop-blur">{p.condition}</span>
                  </div>
                </div>
                <div className="px-1">
                  <p className="text-xs uppercase tracking-wider text-ink-500 mb-1">{p.brand}</p>
                  <h3 className="text-base font-semibold text-ink-950 mb-1 leading-tight">{p.name}</h3>
                  <p className="text-xs text-ink-500 mb-2">{p.color}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-ink-950">£{p.price}</span>
                    <span className="text-sm text-ink-400 line-through">£{p.rrp}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            {[
              { Icon: ShieldCheck, text: '12-month warranty' },
              { Icon: Recycle, text: 'Sustainably refurbished' },
              { Icon: Truck, text: 'Free UK delivery' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-ink-700">
                <Icon size={16} className="text-brand" />
                {text}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
