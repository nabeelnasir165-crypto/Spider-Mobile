import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Filter, X, Check, ShoppingBag } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { phones, conditions } from '../data/products';
import { Reveal } from '../components/Section';
import { useCart, phoneToCartItem } from '../contexts/CartContext';

const PRICE_BANDS = [
  { id: 'any', label: 'Any price', test: () => true },
  { id: 'lt400', label: 'Under £400', test: (p) => p.price < 400 },
  { id: '400-600', label: '£400–£600', test: (p) => p.price >= 400 && p.price <= 600 },
  { id: '600-800', label: '£600–£800', test: (p) => p.price > 600 && p.price <= 800 },
  { id: 'gt800', label: '£800+', test: (p) => p.price > 800 },
];

export default function Refurbished() {
  const brands = useMemo(() => Array.from(new Set(phones.map((p) => p.brand))), []);
  const [brand, setBrand] = useState('all');
  const [condition, setCondition] = useState('all');
  const [priceBand, setPriceBand] = useState('any');

  const filtered = useMemo(
    () =>
      phones.filter((p) => {
        if (brand !== 'all' && p.brand !== brand) return false;
        if (condition !== 'all' && p.condition !== condition) return false;
        const band = PRICE_BANDS.find((b) => b.id === priceBand);
        if (band && !band.test(p)) return false;
        return true;
      }),
    [brand, condition, priceBand]
  );

  return (
    <>
      <PageHeader
        eyebrow="Refurbished Phones"
        title="Like-new phones, certified and warrantied."
        subtitle="Every device is graded, refurbished and sanitised to pristine condition. Save up to 50% vs new with a full 12-month warranty."
      />

      <section className="pb-20 lg:pb-32 bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
            <aside className="lg:sticky lg:top-24 self-start space-y-7">
              <FilterGroup title="Brand">
                <FilterPill active={brand === 'all'} onClick={() => setBrand('all')}>All brands</FilterPill>
                {brands.map((b) => (
                  <FilterPill key={b} active={brand === b} onClick={() => setBrand(b)}>{b}</FilterPill>
                ))}
              </FilterGroup>

              <FilterGroup title="Condition">
                <FilterPill active={condition === 'all'} onClick={() => setCondition('all')}>Any</FilterPill>
                {conditions.map((c) => (
                  <FilterPill key={c} active={condition === c} onClick={() => setCondition(c)}>{c}</FilterPill>
                ))}
              </FilterGroup>

              <FilterGroup title="Price">
                {PRICE_BANDS.map((b) => (
                  <FilterPill key={b.id} active={priceBand === b.id} onClick={() => setPriceBand(b.id)}>{b.label}</FilterPill>
                ))}
              </FilterGroup>

              <div className="p-4 rounded-xl bg-ink-50 border border-ink-100">
                <p className="text-sm font-semibold text-ink-950 mb-1">{filtered.length} of {phones.length} phones</p>
                <p className="text-xs text-ink-500">Filter results update instantly</p>
              </div>
            </aside>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                    >
                      <ProductCard p={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-ink-500">No phones match those filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500 mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-4 rounded-full text-sm font-medium transition border ${
        active
          ? 'bg-ink-950 text-white border-ink-950'
          : 'bg-white text-ink-700 border-ink-200 hover:border-ink-400'
      }`}
    >
      {children}
    </button>
  );
}

function ProductCard({ p }) {
  const { addItem } = useCart();
  const buy = () => addItem(phoneToCartItem(p));
  return (
    <div id={p.id} className="group rounded-2xl bg-white border border-ink-100 overflow-hidden hover:shadow-soft-lg transition">
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${p.accent}22, ${p.accent}66)` }} />
        <motion.img
          src={p.image}
          alt={p.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="pill-accent text-[10px]"><ShieldCheck size={11}/> {p.warranty}mo warranty</span>
          <span className="pill text-[10px] bg-white/80 backdrop-blur"><Check size={10}/> {p.condition}</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-ink-500 mb-1">{p.brand}</p>
        <h3 className="text-base font-semibold text-ink-950 leading-tight">{p.name}</h3>
        <p className="text-xs text-ink-500 mb-2">{p.color}</p>
        {(p.storage || p.display || p.chip) && (
          <ul className="text-[11px] text-ink-600 leading-snug mb-3 space-y-0.5">
            {p.storage && <li><span className="text-ink-400">Storage:</span> {p.storage}</li>}
            {p.display && <li><span className="text-ink-400">Display:</span> {p.display}</li>}
            {p.chip    && <li><span className="text-ink-400">Chip:</span> {p.chip}</li>}
          </ul>
        )}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-ink-950">£{p.price}</span>
            <span className="ml-2 text-sm text-ink-400 line-through">£{p.rrp}</span>
          </div>
          <button onClick={buy} aria-label={`Add ${p.name} to bag`} className="h-9 px-4 rounded-full bg-ink-950 text-white text-xs font-semibold hover:bg-ink-800 transition inline-flex items-center gap-1.5">
            <ShoppingBag size={12}/> Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
