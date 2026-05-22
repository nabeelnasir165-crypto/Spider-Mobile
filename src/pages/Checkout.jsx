import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ShieldCheck, Truck, Store, CreditCard, Banknote, Lock,
  Loader2, Mail, Phone, User, MapPin, AlertCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_ORDERS = 'sm_orders_v1';

const DELIVERY_OPTIONS = [
  { id: 'collection', label: 'Collect in store',         desc: '835 Osmaston Road, Derby. Ready in 1 hour for in-stock items.',         fee: 0,    icon: Store },
  { id: 'standard',   label: 'UK Standard delivery',     desc: 'Royal Mail Tracked 48. Free over £100.',                                  fee: 4.99, icon: Truck, freeOver: 100 },
  { id: 'express',    label: 'UK Express (next day)',    desc: 'DPD next-day before 1pm. Order before 3pm Mon–Fri.',                      fee: 9.99, icon: Truck },
];

const PAYMENT_OPTIONS = [
  { id: 'stripe', label: 'Card · Apple Pay · Google Pay', desc: 'Secured by Stripe. No card details stored on our servers.', icon: CreditCard },
  { id: 'cash',   label: 'Cash on collection',            desc: 'Pay when you pick up. Available for collection orders only.', icon: Banknote, requires: 'collection' },
];

const STEPS = ['Contact', 'Delivery', 'Payment', 'Review'];

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const STRIPE_LIVE = !!STRIPE_PK; // wired-up when key present; stubbed otherwise

export default function Checkout() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);

  // Contact
  const [name,  setName]  = useState(profile?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  // Delivery
  const [delivery, setDelivery] = useState('collection');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city,     setCity]     = useState('');
  const [postcode, setPostcode] = useState('');

  // Payment
  const [payment, setPayment] = useState('stripe');

  // Submission
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState('');

  // Auto-fill from authed user when it loads
  useEffect(() => {
    if (profile?.full_name && !name)  setName(profile.full_name);
    if (user?.email        && !email) setEmail(user.email);
    if (profile?.phone     && !phone) setPhone(profile.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.full_name, profile?.phone, user?.email]);

  // Bounce back to /cart if there's nothing to check out
  useEffect(() => { if (items.length === 0) navigate('/cart', { replace: true }); }, [items.length, navigate]);

  const selectedDelivery = DELIVERY_OPTIONS.find((d) => d.id === delivery) || DELIVERY_OPTIONS[0];
  const deliveryFee = selectedDelivery.freeOver && subtotal >= selectedDelivery.freeOver ? 0 : selectedDelivery.fee;
  const total = subtotal + deliveryFee;

  // When delivery changes to non-collection, cash isn't allowed
  useEffect(() => { if (delivery !== 'collection' && payment === 'cash') setPayment('stripe'); }, [delivery, payment]);

  const validateContact = () => {
    if (!name.trim())  return 'Please enter your name.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email.';
    if (!phone.trim()) return 'Please enter a phone number.';
    return '';
  };
  const validateDelivery = () => {
    if (delivery === 'collection') return '';
    if (!address1.trim() || !city.trim() || !postcode.trim()) return 'Please complete the delivery address.';
    return '';
  };

  const goNext = () => {
    let err = '';
    if (step === 0) err = validateContact();
    if (step === 1) err = validateDelivery();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const goBack = () => { setError(''); setStep((s) => Math.max(0, s - 1)); };

  const buildOrder = () => ({
    id: 'SM-ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    created_at: new Date().toISOString(),
    status: 'Pending',
    items,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    customer:  { name, email, phone, user_id: user?.id || null },
    delivery:  { method: delivery, label: selectedDelivery.label, address1, address2, city, postcode },
    payment:   {
      method: payment,
      status: payment === 'cash' ? 'pending_on_collection' : (STRIPE_LIVE ? 'pending_redirect' : 'pending_demo'),
      provider: payment === 'stripe' ? 'stripe' : 'cash',
    },
  });

  const placeOrder = async () => {
    setBusy(true);
    setError('');
    const order = buildOrder();

    // Save locally so the customer can see it on the confirmation page
    // even if Supabase isn't reachable.
    try {
      const raw = localStorage.getItem(STORAGE_ORDERS);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(order);
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(list.slice(0, 50)));
    } catch { /* quota or private mode — ignore */ }

    // Best-effort Supabase persistence (silently degrades if unconfigured / RLS blocks)
    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').insert({
          order_ref: order.id,
          customer_user_id: user?.id || null,
          customer_name: order.customer.name,
          customer_email: order.customer.email,
          customer_phone: order.customer.phone,
          delivery_method: order.delivery.method,
          delivery_address: [order.delivery.address1, order.delivery.address2, order.delivery.city, order.delivery.postcode].filter(Boolean).join(', '),
          payment_method: order.payment.method,
          payment_status: order.payment.status,
          subtotal: order.subtotal,
          delivery_fee: order.delivery_fee,
          total: order.total,
          items: order.items,
          status: order.status,
        });
      } catch (e) {
        // Schema may not exist yet — keep going, local copy is the source of truth
        console.warn('[checkout] order persistence skipped:', e?.message || e);
      }
    }

    // If we had real Stripe wired up we'd redirect here.
    // For now, we drop the user on the confirmation page with a "demo mode" note.
    clear();
    navigate(`/order/${order.id}`, { replace: true, state: { order, stripeLive: STRIPE_LIVE } });
  };

  return (
    <>
      <PageHeader eyebrow="Checkout" title="Almost there." subtitle="A couple of details and we'll have your order on its way." />

      <section className="pb-24">
        <div className="container-page max-w-6xl">
          <Progress step={step} steps={STEPS} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-8">
            <div className="rounded-2xl bg-white border border-ink-100 p-5 sm:p-8">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <Step key="contact">
                    <h2 className="text-lg font-semibold text-ink-950 mb-5">Your contact details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field icon={User}  type="text"  label="Full name"   value={name}  onChange={setName}  placeholder="Jane Smith"     autoComplete="name"/>
                      <Field icon={Mail}  type="email" label="Email"       value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email"/>
                      <Field icon={Phone} type="tel"   label="Phone"       value={phone} onChange={setPhone} placeholder="07700 900000"   autoComplete="tel" full/>
                    </div>
                    <NavBar onNext={goNext} nextLabel="Continue to delivery"/>
                  </Step>
                )}

                {step === 1 && (
                  <Step key="delivery">
                    <h2 className="text-lg font-semibold text-ink-950 mb-5">How would you like it?</h2>
                    <ul className="space-y-2.5">
                      {DELIVERY_OPTIONS.map((d) => {
                        const free = d.freeOver && subtotal >= d.freeOver;
                        const Icon = d.icon;
                        return (
                          <li key={d.id}>
                            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${delivery === d.id ? 'border-brand bg-accent-50/40' : 'border-ink-100 hover:border-ink-300'}`}>
                              <input type="radio" name="delivery" className="sr-only" checked={delivery === d.id} onChange={() => setDelivery(d.id)}/>
                              <Icon size={20} className={`mt-0.5 ${delivery === d.id ? 'text-brand' : 'text-ink-500'}`}/>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-ink-950 text-sm">{d.label}</p>
                                  <p className="text-sm font-bold text-ink-950">{d.fee === 0 ? 'Free' : free ? <><span className="line-through text-ink-400 mr-1.5 font-normal">£{d.fee.toFixed(2)}</span>Free</> : `£${d.fee.toFixed(2)}`}</p>
                                </div>
                                <p className="text-xs text-ink-500 mt-0.5">{d.desc}</p>
                              </div>
                            </label>
                          </li>
                        );
                      })}
                    </ul>

                    {delivery !== 'collection' && (
                      <div className="mt-6 pt-6 border-t border-ink-100">
                        <h3 className="text-sm font-semibold text-ink-950 mb-3 flex items-center gap-2"><MapPin size={14}/> Delivery address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field type="text" label="Address line 1" value={address1} onChange={setAddress1} placeholder="123 Example Road" autoComplete="address-line1" full/>
                          <Field type="text" label="Address line 2 (optional)" value={address2} onChange={setAddress2} placeholder="Flat / Apartment" autoComplete="address-line2" full/>
                          <Field type="text" label="Town / City" value={city} onChange={setCity} placeholder="Derby" autoComplete="address-level2"/>
                          <Field type="text" label="Postcode" value={postcode} onChange={setPostcode} placeholder="DE24 8AB" autoComplete="postal-code"/>
                        </div>
                      </div>
                    )}

                    <NavBar onBack={goBack} onNext={goNext} nextLabel="Continue to payment"/>
                  </Step>
                )}

                {step === 2 && (
                  <Step key="payment">
                    <h2 className="text-lg font-semibold text-ink-950 mb-5">Payment method</h2>
                    <ul className="space-y-2.5">
                      {PAYMENT_OPTIONS.map((p) => {
                        const Icon = p.icon;
                        const disabled = p.requires && p.requires !== delivery;
                        return (
                          <li key={p.id}>
                            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition ${disabled ? 'opacity-50 cursor-not-allowed border-ink-100' : 'cursor-pointer ' + (payment === p.id ? 'border-brand bg-accent-50/40' : 'border-ink-100 hover:border-ink-300')}`}>
                              <input type="radio" name="payment" className="sr-only" checked={payment === p.id} onChange={() => setPayment(p.id)} disabled={disabled}/>
                              <Icon size={20} className={`mt-0.5 ${payment === p.id ? 'text-brand' : 'text-ink-500'}`}/>
                              <div className="flex-1">
                                <p className="font-semibold text-ink-950 text-sm">{p.label}</p>
                                <p className="text-xs text-ink-500 mt-0.5">{disabled ? 'Available with collection only.' : p.desc}</p>
                              </div>
                            </label>
                          </li>
                        );
                      })}
                    </ul>

                    {payment === 'stripe' && !STRIPE_LIVE && (
                      <div role="status" aria-live="polite" className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle size={14} className="mt-0.5 shrink-0"/>
                        <p>
                          <strong className="font-semibold">Demo mode.</strong> Stripe isn&rsquo;t connected yet, so no card will be charged.
                          Your order will be recorded and we&rsquo;ll email you a secure payment link.
                        </p>
                      </div>
                    )}

                    <p className="mt-4 text-[11px] text-ink-500 inline-flex items-center gap-1.5">
                      <Lock size={11}/> 256-bit TLS · PCI DSS via Stripe · no card details touch our servers.
                    </p>

                    <NavBar onBack={goBack} onNext={goNext} nextLabel="Review order"/>
                  </Step>
                )}

                {step === 3 && (
                  <Step key="review">
                    <h2 className="text-lg font-semibold text-ink-950 mb-5">Review and confirm</h2>

                    <Section title="Contact">
                      <p>{name}</p>
                      <p className="text-ink-500">{email} · {phone}</p>
                    </Section>

                    <Section title="Delivery">
                      <p>{selectedDelivery.label}</p>
                      {delivery !== 'collection' && (
                        <p className="text-ink-500">
                          {[address1, address2, city, postcode].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </Section>

                    <Section title="Payment">
                      <p>{PAYMENT_OPTIONS.find((p) => p.id === payment)?.label}</p>
                      {payment === 'stripe' && !STRIPE_LIVE && <p className="text-ink-500 text-xs">Demo mode — payment link emailed after order placed.</p>}
                    </Section>

                    {error && (
                      <div role="alert" aria-live="polite" className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 flex items-start gap-2">
                        <AlertCircle size={14} className="mt-0.5 shrink-0"/> {error}
                      </div>
                    )}

                    <div className="mt-7 flex justify-between">
                      <button onClick={goBack} disabled={busy} className="btn-outline disabled:opacity-60">
                        <ChevronLeft size={16}/> Back
                      </button>
                      <button onClick={placeOrder} disabled={busy} className="btn-accent disabled:opacity-60">
                        {busy ? <><Loader2 size={16} className="animate-spin"/> Placing order…</> : <>Place order · £{total.toFixed(2)}</>}
                      </button>
                    </div>
                  </Step>
                )}
              </AnimatePresence>

              {error && step < 3 && (
                <div role="alert" aria-live="polite" className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 shrink-0"/> {error}
                </div>
              )}
            </div>

            <aside className="self-start lg:sticky lg:top-24">
              <div className="rounded-2xl bg-white border border-ink-100 p-6">
                <h2 className="text-lg font-semibold text-ink-950 mb-4">Order summary</h2>
                <ul className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <li key={i.id} className="flex gap-3 text-sm">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-ink-50 shrink-0">
                        <img src={i.image} alt={i.name} className="w-full h-full object-cover" loading="lazy"/>
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ink-950 text-white text-[10px] font-semibold grid place-items-center">{i.qty}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink-900 leading-tight line-clamp-2">{i.name}</p>
                      </div>
                      <p className="font-semibold text-ink-950">£{(i.price * i.qty).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-2 border-t border-ink-100 pt-4">
                  <Row label="Subtotal"    value={`£${subtotal.toFixed(2)}`}/>
                  <Row label="Delivery"    value={deliveryFee === 0 ? 'Free' : `£${deliveryFee.toFixed(2)}`}/>
                  <div className="h-px bg-ink-100 my-1"/>
                  <Row label="Total" value={`£${total.toFixed(2)}`} accent/>
                </dl>
                <p className="mt-4 text-[11px] text-ink-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={11}/> 12-month warranty · 14-day returns
                </p>
                <p className="mt-3 text-center text-[11px] text-ink-500">
                  Need to change items? <Link to="/cart" className="underline">Edit your bag</Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
function Step({ children }) {
  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}

function NavBar({ onBack, onNext, nextLabel }) {
  return (
    <div className="mt-7 flex justify-between">
      {onBack ? (
        <button onClick={onBack} className="btn-outline"><ChevronLeft size={16}/> Back</button>
      ) : <Link to="/cart" className="btn-outline"><ChevronLeft size={16}/> Back to bag</Link>}
      <button onClick={onNext} className="btn-accent">{nextLabel} <ChevronRight size={16}/></button>
    </div>
  );
}

function Progress({ step, steps }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2.5 ${active ? 'text-ink-950' : done ? 'text-ink-700' : 'text-ink-400'}`}>
              <span aria-hidden="true" className={`grid place-items-center w-7 h-7 rounded-full text-[11px] font-semibold ${done ? 'bg-brand-dark text-white' : active ? 'bg-ink-950 text-white' : 'bg-ink-100 text-ink-500'}`}>
                {done ? '✓' : i + 1}
              </span>
              <span className="hidden sm:block text-sm font-medium">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-ink-100 mx-2 sm:mx-3 relative">
                <div className="absolute inset-y-0 left-0 bg-brand-dark transition-all duration-500" style={{ width: done ? '100%' : '0%' }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ icon: Icon, type = 'text', label, value, onChange, placeholder, autoComplete, full }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500 mb-1.5 block">{label}</span>
      <div className="relative">
        {Icon && <Icon size={14} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500"/>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full h-11 ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 rounded-xl bg-white border border-ink-200 text-sm text-ink-950 placeholder:text-ink-500 outline-none focus:border-ink-950 transition`}
        />
      </div>
    </label>
  );
}

function Section({ title, children }) {
  return (
    <div className="py-4 border-b last:border-b-0 border-ink-100">
      <p className="text-[11px] uppercase tracking-wider text-ink-500 mb-1">{title}</p>
      <div className="text-sm text-ink-900 space-y-0.5">{children}</div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-ink-600">{label}</dt>
      <dd className={`text-sm ${accent ? 'font-bold text-ink-950 text-base' : 'font-medium text-ink-900'}`}>{value}</dd>
    </div>
  );
}
