import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { accessories, accessoryCategories } from '../data/products';

export default function Accessories() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('category') || 'all';
  const [active, setActive] = useState(initial);

  useEffect(() => {
    if (active === 'all') {
      params.delete('category');
      setParams(params, { replace: true });
    } else {
      params.set('category', active);
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const filtered = useMemo(
    () => (active === 'all' ? accessories : accessories.filter((a) => a.category === active)),
    [active]
  );

  return (
    <>
      <PageHeader
        eyebrow="Accessories"
        title="Premium accessories for every device."
        subtitle="Hand-picked cases, chargers and audio gear — all built to last and fitted in-store for free."
      />

      <section className="pb-20 lg:pb-32 bg-white">
        <div className="container-page">
          <div className="flex flex-wrap gap-2 mb-10">
            <CategoryPill active={active === 'all'} onClick={() => setActive('all')}>
              All
            </CategoryPill>
            {accessoryCategories.map((c) => (
              <CategoryPill key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
                {c.name}
              </CategoryPill>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((a, i) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="group rounded-2xl bg-white border border-ink-100 overflow-hidden hover:shadow-soft-lg transition"
                >
                  <div className="relative aspect-square overflow-hidden bg-ink-50">
                    <motion.img
                      src={a.image}
                      alt={a.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-wider text-ink-500 mb-1">{a.forModel}</p>
                    <h3 className="text-sm font-semibold text-ink-950 leading-tight mb-2 line-clamp-2">{a.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-ink-950">£{a.price}</span>
                      <button className="h-8 px-3 rounded-full bg-ink-950 text-white text-xs font-semibold hover:bg-ink-800 transition">
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-5 rounded-full text-sm font-medium transition border ${
        active
          ? 'bg-ink-950 text-white border-ink-950'
          : 'bg-white text-ink-700 border-ink-200 hover:border-ink-400'
      }`}
    >
      {children}
    </button>
  );
}
