import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShieldCheck, ShoppingBag, ChevronRight, Truck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Your bag" title="Your bag is empty." subtitle="Browse our refurbished phones and accessories." />
        <section className="pb-24">
          <div className="container-page max-w-2xl text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-ink-50 grid place-items-center mb-6">
              <ShoppingBag size={32} className="text-ink-400"/>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/refurbished" className="btn-accent">Shop refurbished</Link>
              <Link to="/accessories" className="btn-outline">Shop accessories</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Your bag" title="Review your items." subtitle="Adjust quantities or remove items before you check out." />

      <section className="pb-24">
        <div className="container-page max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <div className="rounded-2xl bg-white border border-ink-100 overflow-hidden">
              <ul className="divide-y divide-ink-100">
                <AnimatePresence initial={false}>
                  {items.map((i) => (
                    <motion.li
                      key={i.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:p-5 flex gap-4"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-ink-50 shrink-0">
                        <img src={i.image} alt={i.name} className="w-full h-full object-cover" loading="lazy"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-ink-500">{i.kind === 'phone' ? i.brand : 'Accessory'}</p>
                            <h3 className="text-sm sm:text-base font-semibold text-ink-950 leading-tight">{i.name}</h3>
                            {i.meta?.color &&    <p className="text-xs text-ink-500 mt-0.5">{i.meta.color}{i.meta.storage ? ` · ${i.meta.storage}` : ''}{i.meta.condition ? ` · ${i.meta.condition}` : ''}</p>}
                            {i.meta?.forModel && <p className="text-xs text-ink-500 mt-0.5">For {i.meta.forModel}</p>}
                          </div>
                          <button
                            onClick={() => removeItem(i.id)}
                            aria-label={`Remove ${i.name}`}
                            className="text-ink-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center border border-ink-200 rounded-full">
                            <button onClick={() => updateQty(i.id, i.qty - 1)} aria-label="Decrease quantity" className="w-8 h-8 grid place-items-center text-ink-700 hover:bg-ink-50 rounded-l-full">
                              <Minus size={13}/>
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-ink-950">{i.qty}</span>
                            <button onClick={() => updateQty(i.id, i.qty + 1)} aria-label="Increase quantity" className="w-8 h-8 grid place-items-center text-ink-700 hover:bg-ink-50 rounded-r-full">
                              <Plus size={13}/>
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold text-ink-950">£{(i.price * i.qty).toFixed(2)}</p>
                            {i.qty > 1 && <p className="text-[11px] text-ink-500">£{i.price.toFixed(2)} each</p>}
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <div className="p-4 border-t border-ink-100 flex items-center justify-between">
                <button onClick={clear} className="text-sm text-ink-500 hover:text-red-600 inline-flex items-center gap-1.5">
                  <Trash2 size={14}/> Empty bag
                </button>
                <Link to="/refurbished" className="text-sm font-semibold text-ink-900 hover:text-ink-950">Continue shopping</Link>
              </div>
            </div>

            <OrderSummary subtotal={subtotal} count={items.reduce((s, i) => s + i.qty, 0)} />
          </div>
        </div>
      </section>
    </>
  );
}

function OrderSummary({ subtotal, count }) {
  return (
    <aside className="self-start lg:sticky lg:top-24">
      <div className="rounded-2xl bg-white border border-ink-100 p-6">
        <h2 className="text-lg font-semibold text-ink-950 mb-4">Order summary</h2>
        <dl className="space-y-2.5 mb-5">
          <Row label={`Subtotal (${count} ${count === 1 ? 'item' : 'items'})`} value={`£${subtotal.toFixed(2)}`}/>
          <Row label="Delivery" value="At checkout" mute/>
          <Row label="VAT (included)" value="—" mute/>
          <div className="h-px bg-ink-100 my-2"/>
          <Row label="Total" value={`£${subtotal.toFixed(2)}`} accent/>
        </dl>
        <Link to="/checkout" className="btn-accent w-full">
          Checkout <ChevronRight size={16}/>
        </Link>
        <ul className="mt-5 space-y-2 text-xs text-ink-600">
          <li className="flex items-start gap-2"><ShieldCheck size={14} className="text-brand mt-0.5 shrink-0"/> 12-month warranty on every phone and repair.</li>
          <li className="flex items-start gap-2"><Truck       size={14} className="text-brand mt-0.5 shrink-0"/> Free UK delivery on orders over £100, or collect in Derby.</li>
        </ul>
      </div>
    </aside>
  );
}

function Row({ label, value, accent, mute }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={`text-sm ${mute ? 'text-ink-400' : 'text-ink-600'}`}>{label}</dt>
      <dd className={`text-sm ${accent ? 'font-bold text-ink-950 text-base' : 'font-medium text-ink-900'}`}>{value}</dd>
    </div>
  );
}
