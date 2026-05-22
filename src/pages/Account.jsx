import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, LogOut, Plus, Smartphone, ChevronRight, Loader2, ShieldCheck, CheckCircle2, AlertCircle, ShoppingBag, Package } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { stages } from '../data/track';

const STORAGE_ORDERS = 'sm_orders_v1';

export default function Account() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingOrders,   setLoadingOrders]   = useState(true);
  const [loadError, setLoadError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoadError('');
      try {
        const { data, error } = await Promise.race([
          supabase.from('bookings').select('*').eq('customer_user_id', user.id).order('created_at', { ascending: false }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Query timed out after 12s. Check Supabase config and that migrations have been run.')), 12000)
          ),
        ]);
        if (error) throw error;
        if (!cancelled) setBookings(data || []);
      } catch (e) {
        if (!cancelled) {
          setLoadError(e?.message || String(e));
          setBookings([]);
        }
      } finally {
        if (!cancelled) setLoadingBookings(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Orders: merge server-side (Supabase) + browser-side (localStorage). The
  // server query may fail or return 0 rows if the orders table or RLS isn't
  // ready — localStorage keeps the customer's just-placed orders visible.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let merged = [];
      try {
        const raw = localStorage.getItem(STORAGE_ORDERS);
        if (raw) merged = JSON.parse(raw).filter((o) => !user || o.customer?.user_id === user.id || o.customer?.email === user.email);
      } catch { /* corrupt or unavailable */ }

      if (user) {
        try {
          const { data, error } = await Promise.race([
            supabase.from('orders').select('*').eq('customer_user_id', user.id).order('created_at', { ascending: false }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
          ]);
          if (!error && data?.length) {
            // Server orders win over localStorage if both have the same ref
            const seen = new Set(data.map((o) => o.order_ref));
            const fromServer = data.map((o) => ({
              id: o.order_ref,
              created_at: o.created_at,
              status: o.status,
              total: Number(o.total),
              items: o.items || [],
              delivery: { method: o.delivery_method, label: o.delivery_method === 'collection' ? 'Collect in store' : 'Delivery' },
              payment: { method: o.payment_method, status: o.payment_status },
            }));
            const localOnly = merged.filter((o) => !seen.has(o.id));
            merged = [...fromServer, ...localOnly];
          }
        } catch (e) {
          console.warn('[account] orders fetch skipped:', e?.message || e);
        }
      }
      if (!cancelled) {
        setOrders(merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setLoadingOrders(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ full_name: name, phone });
    setSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  };

  return (
    <>
      <PageHeader
        eyebrow={`Hi, ${profile?.full_name?.split(' ')[0] || 'there'}`}
        title="Your account"
        subtitle="Manage your bookings, repairs and profile — all in one place."
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/book" className="btn-accent">
            <Plus size={16}/> New repair booking
          </Link>
          <button onClick={signOut} className="btn-outline">
            <LogOut size={16}/> Sign out
          </button>
        </div>
      </PageHeader>

      <section className="pb-24 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          <div>
            <h2 className="text-xl font-bold text-ink-950 mb-5 flex items-center gap-2">
              <Smartphone size={20}/> Your bookings
            </h2>

            {loadingBookings ? (
              <div className="py-16 grid place-items-center text-ink-500">
                <Loader2 className="animate-spin" size={24}/>
                <p className="text-xs mt-3">Loading your bookings…</p>
              </div>
            ) : loadError ? (
              <div role="alert" aria-live="polite" className="p-6 rounded-2xl bg-red-50 border border-red-100">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-semibold text-red-900 mb-1">Couldn&rsquo;t load your bookings</p>
                    <p className="text-sm text-red-700 font-mono break-words">{loadError}</p>
                    <p className="text-sm text-red-700 mt-2">
                      This usually means the database migration hasn&rsquo;t been run yet. Open Supabase → SQL Editor and run
                      <code className="px-1.5 py-0.5 mx-1 rounded bg-red-100 font-mono text-xs">supabase/migrations/20260519_customer_auth.sql</code>.
                    </p>
                  </div>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <EmptyBookings />
            ) : (
              <div className="space-y-4">
                {bookings.map((b, i) => (
                  <BookingCard key={b.id} booking={b} i={i} />
                ))}
              </div>
            )}

            <h2 className="mt-12 text-xl font-bold text-ink-950 mb-5 flex items-center gap-2">
              <ShoppingBag size={20}/> Your orders
            </h2>
            {loadingOrders ? (
              <div className="py-12 grid place-items-center text-ink-500">
                <Loader2 className="animate-spin" size={22}/>
                <p className="text-xs mt-3">Loading your orders…</p>
              </div>
            ) : orders.length === 0 ? (
              <EmptyOrders />
            ) : (
              <div className="space-y-4">
                {orders.map((o, i) => (
                  <OrderCard key={o.id} order={o} i={i} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <div className="p-6 rounded-2xl bg-white border border-ink-100 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500 mb-4">Profile</p>
              <form onSubmit={saveProfile} className="space-y-3">
                <Field icon={User} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"/>
                <Field icon={Mail} value={user?.email || ''} readOnly disabled placeholder="Email"/>
                <Field icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (UK)"/>
                <button type="submit" disabled={saving} className="btn-primary w-full h-10 text-[13px] disabled:opacity-60">
                  {saving ? <Loader2 size={14} className="animate-spin"/> : savedFlash ? <><CheckCircle2 size={14}/> Saved</> : 'Save changes'}
                </button>
              </form>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-ink-950 to-ink-800 text-white">
              <ShieldCheck size={20} className="text-brand-light mb-3"/>
              <p className="font-semibold">All your repairs are warranty-tracked.</p>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">
                We keep records of every device we touch so warranty claims are seamless.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({ icon: Icon, ...rest }) {
  return (
    <div className="relative">
      <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
      <input
        {...rest}
        className="w-full h-10 pl-10 pr-3 rounded-lg bg-ink-50 border border-ink-100 text-sm text-ink-950 placeholder:text-ink-400 outline-none focus:border-ink-950 disabled:opacity-60 disabled:cursor-not-allowed transition"
      />
    </div>
  );
}

function EmptyBookings() {
  return (
    <div className="p-10 rounded-2xl bg-ink-50 border border-dashed border-ink-200 text-center">
      <div className="w-12 h-12 rounded-xl bg-white text-brand grid place-items-center mx-auto mb-4">
        <Smartphone size={22}/>
      </div>
      <p className="font-semibold text-ink-950 mb-1">No bookings yet</p>
      <p className="text-sm text-ink-500 mb-5">Book your first repair and we&rsquo;ll start tracking everything for you.</p>
      <Link to="/book" className="btn-accent">
        <Plus size={16}/> Book a repair
      </Link>
    </div>
  );
}

function BookingCard({ booking, i }) {
  const stage = Math.max(0, Math.min(stages.length - 1, booking.stage ?? 0));
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.4 }}
      className="rounded-2xl bg-white border border-ink-100 overflow-hidden hover:shadow-soft-lg transition"
    >
      <div className="p-5 lg:p-6 flex flex-wrap items-start justify-between gap-4 border-b border-ink-100">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-ink-500 mb-1.5">{booking.booking_ref}</p>
          <h3 className="text-base font-semibold text-ink-950">
            {booking.device_brand || 'Device'} · {booking.device_model || 'Unknown model'}
          </h3>
          <p className="text-sm text-ink-600 mt-1">{booking.issue || booking.service_requested || 'Repair'}</p>
        </div>
        <StatusPill status={booking.status} />
      </div>

      <div className="p-5 lg:p-6">
        <div className="flex items-center gap-1.5">
          {stages.map((s, idx) => {
            const done = idx <= stage;
            return (
              <React.Fragment key={s.key}>
                <div className={`flex-1 h-1.5 rounded-full ${done ? 'bg-brand' : 'bg-ink-100'}`} />
              </React.Fragment>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
          <span>{stages[stage]?.label}</span>
          <Link to={`/track?ref=${encodeURIComponent(booking.booking_ref)}`} className="text-brand font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all">
            View details <ChevronRight size={12}/>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function OrderCard({ order, i }) {
  const itemCount = order.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0;
  const previewItems = (order.items || []).slice(0, 3);
  const placed = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.4 }}
      className="rounded-2xl bg-white border border-ink-100 overflow-hidden hover:shadow-soft-lg transition"
    >
      <div className="p-5 lg:p-6 flex flex-wrap items-start justify-between gap-4 border-b border-ink-100">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-ink-500 mb-1.5">{order.id}</p>
          <h3 className="text-base font-semibold text-ink-950 flex items-center gap-2">
            <Package size={16} className="text-ink-500"/> {itemCount} item{itemCount === 1 ? '' : 's'} · £{Number(order.total).toFixed(2)}
          </h3>
          <p className="text-sm text-ink-600 mt-1">Placed {placed} · {order.delivery?.label || 'Delivery'}</p>
        </div>
        <OrderStatusPill payment={order.payment} status={order.status}/>
      </div>
      {previewItems.length > 0 && (
        <div className="p-5 lg:p-6 flex items-center gap-3">
          <div className="flex -space-x-2">
            {previewItems.map((it) => (
              <div key={it.id} className="w-10 h-10 rounded-lg overflow-hidden bg-ink-50 border border-white ring-1 ring-ink-100">
                <img src={it.image} alt="" className="w-full h-full object-cover" loading="lazy"/>
              </div>
            ))}
            {order.items.length > previewItems.length && (
              <div className="w-10 h-10 rounded-lg bg-ink-100 text-ink-600 grid place-items-center text-[10px] font-semibold border border-white ring-1 ring-ink-100">
                +{order.items.length - previewItems.length}
              </div>
            )}
          </div>
          <p className="text-sm text-ink-600 line-clamp-1 flex-1">
            {previewItems.map((it) => it.name).join(', ')}
          </p>
          <Link to={`/order/${order.id}`} className="text-brand font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all text-sm">
            View <ChevronRight size={14}/>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function EmptyOrders() {
  return (
    <div className="p-10 rounded-2xl bg-ink-50 border border-dashed border-ink-200 text-center">
      <div className="w-12 h-12 rounded-xl bg-white text-brand grid place-items-center mx-auto mb-4">
        <ShoppingBag size={22}/>
      </div>
      <p className="font-semibold text-ink-950 mb-1">No orders yet</p>
      <p className="text-sm text-ink-500 mb-5">Pick up a refurbished phone or accessory and we&rsquo;ll keep the receipts here.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/refurbished" className="btn-accent">Shop refurbished</Link>
        <Link to="/accessories" className="btn-outline">Shop accessories</Link>
      </div>
    </div>
  );
}

function OrderStatusPill({ payment, status }) {
  const paid = payment?.status === 'paid';
  const pendingDemo = payment?.status === 'pending_demo';
  const cash = payment?.method === 'cash';
  const label = paid ? 'Paid' : pendingDemo ? 'Awaiting payment' : cash ? 'Pay on collection' : (status || 'Pending');
  const className = paid
    ? 'bg-emerald-100 text-emerald-800'
    : pendingDemo
      ? 'bg-amber-100 text-amber-800'
      : 'bg-sky-100 text-sky-800';
  return <span className={`pill ${className}`}>{label}</span>;
}

function StatusPill({ status }) {
  const s = (status || 'Pending').toLowerCase();
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-sky-100 text-sky-800',
    converted: 'bg-emerald-100 text-emerald-800',
    ready: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-emerald-100 text-emerald-800',
  };
  return (
    <span className={`pill ${map[s] || 'bg-ink-100 text-ink-700'}`}>{status || 'Pending'}</span>
  );
}
