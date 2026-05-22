import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Truck, Store, Package, Lock, CreditCard, Banknote, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const STORAGE_ORDERS = 'sm_orders_v1';
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const STRIPE_LIVE = !!STRIPE_PK;

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const passed = location.state?.order;
  const stripeLiveFromState = location.state?.stripeLive;
  const stripeLive = stripeLiveFromState ?? STRIPE_LIVE;
  const [order, setOrder] = useState(passed || null);
  const [notFound, setNotFound] = useState(false);

  // If the user landed here via direct link, recover from localStorage.
  useEffect(() => {
    if (order) return;
    try {
      const raw = localStorage.getItem(STORAGE_ORDERS);
      const list = raw ? JSON.parse(raw) : [];
      const found = list.find((o) => o.id === id);
      if (found) setOrder(found);
      else setNotFound(true);
    } catch { setNotFound(true); }
  }, [id, order]);

  if (notFound) {
    return (
      <>
        <PageHeader eyebrow="Order" title="Order not found." subtitle="That order reference doesn't match anything in your browser." />
        <section className="pb-24">
          <div className="container-page max-w-xl text-center">
            <Link to="/account" className="btn-accent">Go to my account</Link>
          </div>
        </section>
      </>
    );
  }

  if (!order) return null;

  const isCollection = order.delivery.method === 'collection';
  const isCash = order.payment.method === 'cash';
  const isDemo = order.payment.status === 'pending_demo';

  return (
    <>
      <PageHeader eyebrow="Order confirmed" title="Thanks — you're all set." subtitle="A confirmation email is on its way to your inbox." />

      <section className="pb-24">
        <div className="container-page max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-gradient-to-br from-ink-950 to-ink-800 text-white p-8 lg:p-10 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500 grid place-items-center"><CheckCircle2 size={22}/></div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Order ref</p>
                <p className="text-2xl font-bold">{order.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Info label="Items"  value={`${order.items.reduce((s, i) => s + i.qty, 0)} item${order.items.length === 1 ? '' : 's'}`}/>
              <Info label="Total"  value={`£${order.total.toFixed(2)}`}/>
              <Info label="Delivery" value={order.delivery.label}/>
              <Info label="Payment"  value={isCash ? 'Cash on collection' : 'Card via Stripe'}/>
            </div>
          </motion.div>

          {/* Next steps banner */}
          {isDemo && (
            <div role="status" aria-live="polite" className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-sm text-amber-900 flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0"/>
              <div>
                <p className="font-semibold mb-1">Payment pending (demo mode)</p>
                <p className="text-amber-800">
                  Stripe isn&rsquo;t connected yet, so we haven&rsquo;t taken payment. We&rsquo;ll email you a secure
                  payment link within the next few minutes. Your items are reserved.
                </p>
              </div>
            </div>
          )}

          {isCash && (
            <div role="status" aria-live="polite" className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-900 flex items-start gap-3">
              <Banknote size={18} className="mt-0.5 shrink-0"/>
              <div>
                <p className="font-semibold mb-1">Pay when you collect</p>
                <p className="text-emerald-800">
                  Bring this order reference to <strong>835 Osmaston Road, Derby</strong>. We accept cash or card on arrival.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <Card icon={isCollection ? Store : Truck} title={isCollection ? 'Collection' : 'Delivery'}>
              <p className="font-semibold text-ink-950">{order.delivery.label}</p>
              {isCollection ? (
                <p className="text-sm text-ink-600 mt-1">835 Osmaston Road, Derby<br/>Open Mon–Sat 09:00–18:30</p>
              ) : (
                <p className="text-sm text-ink-600 mt-1">
                  {[order.delivery.address1, order.delivery.address2, order.delivery.city, order.delivery.postcode].filter(Boolean).join(', ')}
                </p>
              )}
            </Card>

            <Card icon={isCash ? Banknote : CreditCard} title="Payment">
              <p className="font-semibold text-ink-950">{isCash ? 'Cash on collection' : 'Card · Apple Pay · Google Pay'}</p>
              <p className="text-sm text-ink-600 mt-1">
                {isDemo ? 'Awaiting payment link (sent by email).' : isCash ? 'Pay in store when you collect.' : stripeLive ? 'Securely processed by Stripe.' : 'Payment recorded.'}
              </p>
            </Card>
          </div>

          <div className="rounded-2xl bg-white border border-ink-100 overflow-hidden mb-6">
            <h2 className="text-sm font-semibold text-ink-950 px-5 py-4 border-b border-ink-100 flex items-center gap-2">
              <Package size={16}/> Items
            </h2>
            <ul className="divide-y divide-ink-100">
              {order.items.map((i) => (
                <li key={i.id} className="p-4 flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-ink-50 shrink-0">
                    <img src={i.image} alt={i.name} className="w-full h-full object-cover" loading="lazy"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-950 leading-tight">{i.name}</p>
                    {i.meta?.color    && <p className="text-xs text-ink-500">{i.meta.color}{i.meta.storage ? ` · ${i.meta.storage}` : ''}</p>}
                    {i.meta?.forModel && <p className="text-xs text-ink-500">For {i.meta.forModel}</p>}
                    <p className="text-xs text-ink-500 mt-0.5">Qty {i.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-ink-950">£{(i.price * i.qty).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <dl className="px-5 py-4 space-y-1.5 border-t border-ink-100 text-sm">
              <Row label="Subtotal" value={`£${order.subtotal.toFixed(2)}`}/>
              <Row label="Delivery" value={order.delivery_fee === 0 ? 'Free' : `£${order.delivery_fee.toFixed(2)}`}/>
              <Row label="Total"    value={`£${order.total.toFixed(2)}`} accent/>
            </dl>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/account" className="btn-primary">Go to my account</Link>
            <Link to="/refurbished" className="btn-outline">Continue shopping</Link>
          </div>

          <p className="mt-6 text-center text-xs text-ink-500 inline-flex items-center justify-center gap-1.5 w-full">
            <Lock size={11}/> Your data is encrypted end-to-end. Questions? <Link to="/contact" className="underline ml-1">Contact us</Link>
          </p>
        </div>
      </section>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-white/55 mb-1">{label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl bg-white border border-ink-100 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-ink-950 text-white grid place-items-center"><Icon size={15}/></div>
        <p className="text-xs uppercase tracking-wider text-ink-500">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-600">{label}</dt>
      <dd className={accent ? 'font-bold text-ink-950 text-base' : 'font-medium text-ink-900'}>{value}</dd>
    </div>
  );
}
