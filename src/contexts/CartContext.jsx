import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

const STORAGE_KEY = 'sm_cart_v1';

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.items || [];
    case 'ADD': {
      const { item, qty } = action;
      const existing = state.find((i) => i.id === item.id);
      if (existing) return state.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
      return [...state, { ...item, qty }];
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'SET_QTY':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: Math.max(0, action.qty) } : i))
        .filter((i) => i.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', items: JSON.parse(raw) });
    } catch { /* ignore corrupt cart */ }
    setHydrated(true);
  }, []);

  // Persist on change (only after first hydration so we don't wipe storage)
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
    catch { /* quota or private mode — silently ignore */ }
  }, [items, hydrated]);

  const count    = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items]);

  const value = useMemo(() => ({
    items,
    count,
    subtotal,
    isOpen,
    openCart:   () => setIsOpen(true),
    closeCart:  () => setIsOpen(false),
    toggleCart: () => setIsOpen((o) => !o),
    addItem:    (item, qty = 1) => { dispatch({ type: 'ADD', item, qty }); setIsOpen(true); },
    removeItem: (id) => dispatch({ type: 'REMOVE', id }),
    updateQty:  (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    clear:      () => dispatch({ type: 'CLEAR' }),
  }), [items, count, subtotal, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

// ─── Adapters: convert page-level product shapes into a uniform cart item ───
export const phoneToCartItem = (p) => ({
  id: p.id,
  kind: 'phone',
  name: p.name,
  brand: p.brand,
  price: p.price,
  image: p.image,
  meta: { color: p.color, storage: p.storage, condition: p.condition },
});

export const accessoryToCartItem = (a) => ({
  id: a.id,
  kind: 'accessory',
  name: a.name,
  brand: a.forModel,
  price: a.price,
  image: a.image,
  meta: { forModel: a.forModel },
});
