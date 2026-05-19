import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { accessoryCategories } from '../data/products';
import { SectionHeader, Reveal } from '../components/Section';

export default function AccessoriesPreview() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Accessories"
            title="Everything to keep your phone protected, powered and connected."
          />
          <Reveal delay={0.1}>
            <Link to="/accessories" className="btn-outline shrink-0">
              Shop accessories <ChevronRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {accessoryCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <Link
                to={`/accessories?category=${cat.id}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden block bg-ink-950"
              >
                <motion.img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-tr ${cat.accent}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />

                <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-end text-white">
                  <h3 className="text-lg lg:text-xl font-bold mb-1.5">{cat.name}</h3>
                  <p className="text-xs lg:text-sm text-white/75 line-clamp-2 mb-3">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90 group-hover:gap-2 transition-all">
                    Shop now <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
