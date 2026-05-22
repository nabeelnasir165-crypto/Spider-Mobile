import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, ChevronRight, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, count, removeItem, updateQty } = useCart();
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Lock body scroll + focus trap + Esc handler while open (WCAG 2.1.2)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeCart(); return; }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus();  e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-ink-950/60 backdrop-blur" onClick={closeCart} />
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-ink-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-ink-700"/>
                <h2 className="font-semibold text-ink-950">Your bag</h2>
                {count > 0 && <span className="pill text-[10px] ml-1">{count} {count === 1 ? 'item' : 'items'}</span>}
              </div>
              <button
                ref={closeBtnRef}
                onClick={closeCart}
                aria-label="Close cart"
                className="grid place-items-center w-10 h-10 rounded-full bg-ink-50 text-ink-950 hover:bg-ink-100"
              >
                <X size={18}/>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-ink-50 grid place-items-center mb-4">
                  <ShoppingBag size={24} className="text-ink-400"/>
                </div>
                <p className="font-semibold text-ink-950 mb-1">Your bag is empty</p>
                <p className="text-sm text-ink-500 mb-6">Add a refurbished phone or accessory to get started.</p>
                <div className="flex flex-col gap-2 w-full">
                  <Link onClick={closeCart} to="/refurbished" className="btn-accent w-full">Shop refurbished</Link>
                  <Link onClick={closeCart} to="/accessories" className="btn-outline w-full">Shop accessories</Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-ink-100">
                  {items.map((i) => (
                    <li key={i.id} className="py-4 flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-ink-50 shrink-0">
                        <img src={i.image} alt={i.name} className="w-full h-full object-cover" loading="lazy"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-950 leading-tight line-clamp-2">{i.name}</p>
                        {i.meta?.color &&    <p className="text-[11px] text-ink-500">{i.meta.color}{i.meta.storage ? ` · ${i.meta.storage}` : ''}</p>}
                        {i.meta?.forModel && <p className="text-[11px] text-ink-500">For {i.meta.forModel}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <div className="inline-flex items-center border border-ink-200 rounded-full">
                            <button
                              onClick={() => updateQty(i.id, i.qty - 1)}
                              aria-label="Decrease quantity"
                              className="w-7 h-7 grid place-items-center text-ink-700 hover:bg-ink-50 rounded-l-full"
                            >
                              <Minus size={12}/>
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-ink-950">{i.qty}</span>
                            <button
                              onClick={() => updateQty(i.id, i.qty + 1)}
                              aria-label="Increase quantity"
                              className="w-7 h-7 grid place-items-center text-ink-700 hover:bg-ink-50 rounded-r-full"
                            >
                              <Plus size={12}/>
                            </button>
                          </div>
                          <p className="text-sm font-bold text-ink-950">£{(i.price * i.qty).toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(i.id)}
                        aria-label={`Remove ${i.name}`}
                        className="self-start text-ink-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-ink-100 p-5 bg-ink-50/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-ink-600">Subtotal</span>
                    <span className="text-lg font-bold text-ink-950">£{subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-ink-500 mb-4">Delivery and taxes calculated at checkout.</p>

                  <Link onClick={closeCart} to="/checkout" className="btn-accent w-full">
                    Checkout <ChevronRight size={16}/>
                  </Link>
                  <Link onClick={closeCart} to="/cart" className="btn-outline w-full mt-2">View bag</Link>
                  <p className="mt-3 text-[11px] text-ink-500 flex items-center justify-center gap-1.5">
                    <Lock size={11}/> Secure checkout · 12-month warranty
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
