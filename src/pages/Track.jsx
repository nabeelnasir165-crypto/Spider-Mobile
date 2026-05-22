import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, PackageCheck, Wrench, ScanLine, CheckCircle2, Smartphone, AlertCircle, ChevronRight, Loader2,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { lookupTicket, stages } from '../data/track';
import { Reveal } from '../components/Section';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const stageIcons = [PackageCheck, ScanLine, Wrench, CheckCircle2, Smartphone];

export default function Track() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const initialRef = params.get('ref') || '';

  const [input, setInput] = useState(initialRef);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  const [myBookings, setMyBookings] = useState([]);
  const [loadingMine, setLoadingMine] = useState(false);

  // Auto-search when ref is in the URL
  useEffect(() => {
    if (initialRef) search(initialRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRef]);

  // Load logged-in user's bookings
  useEffect(() => {
    if (!user) return;
    setLoadingMine(true);
    (async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setMyBookings(data || []);
      setLoadingMine(false);
    })();
  }, [user]);

  const search = async (overrideRef) => {
    const q = (overrideRef ?? input).trim();
    if (!q) return;
    setError('');
    setSearching(true);

    // 1. Try database (real bookings)
    const { data: dbHit } = await supabase
      .from('bookings')
      .select('*')
      .or(`booking_ref.eq.${q.toUpperCase()},customer_phone.eq.${q}`)
      .limit(1)
      .maybeSingle();

    setSearching(false);

    if (dbHit) {
      setTicket(toTicket(dbHit));
      return;
    }

    // 2. Fallback to mock data (demo IDs from data/track.js)
    const found = lookupTicket(q);
    if (found) {
      setTicket(found);
    } else {
      setTicket(null);
      setError("We couldn't find that ID or number. Try SM-2451, SM-2469, or 07700900111.");
    }
  };

  const onSubmit = (e) => { e.preventDefault(); search(); };

  return (
    <>
      <PageHeader
        eyebrow="Track Repair"
        title="Where&rsquo;s my phone? Find out in real-time."
        subtitle={user
          ? 'Your bookings are below. Or enter any repair ID or mobile number to look up another.'
          : 'Enter your repair ID (e.g. SM-2451) or the mobile number we have on file. Or sign in to see all your repairs.'}
      >
        {!user && (
          <div className="flex flex-wrap gap-2.5">
            <Link to="/login" className="btn-outline h-10 px-4 text-[13px]">Sign in</Link>
            <Link to="/signup" className="btn-accent h-10 px-4 text-[13px]">Create account</Link>
          </div>
        )}
      </PageHeader>

      <section className="pb-24 lg:pb-32 bg-white">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={onSubmit} className="relative flex items-center gap-2 p-2 rounded-full bg-ink-50 border border-ink-200 focus-within:border-ink-400 transition">
              <Search size={18} className="ml-3 text-ink-400 shrink-0" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Repair ID or mobile number"
                className="flex-1 bg-transparent h-10 outline-none text-sm text-ink-950 placeholder:text-ink-400"
              />
              <button type="submit" disabled={searching} className="btn-accent h-10 px-5 text-[13px] disabled:opacity-60">
                {searching ? <Loader2 size={14} className="animate-spin"/> : 'Track'}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div role="alert" aria-live="polite" key="err" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 p-5 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {ticket && <TicketDetail key={ticket.id} ticket={ticket} />}
            </AnimatePresence>

            {/* User's own bookings */}
            {user && !ticket && (
              <div className="mt-12">
                <h2 className="text-lg font-semibold text-ink-950 mb-4">Your recent bookings</h2>
                {loadingMine ? (
                  <div className="py-10 grid place-items-center text-ink-500">
                    <Loader2 className="animate-spin" size={22}/>
                  </div>
                ) : myBookings.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-ink-50 border border-dashed border-ink-200 text-center">
                    <p className="text-sm text-ink-600">No bookings yet. <Link to="/book" className="text-brand font-medium">Book your first repair</Link>.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myBookings.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => search(b.booking_ref)}
                        className="w-full p-5 rounded-2xl bg-white border border-ink-100 hover:border-ink-300 hover:shadow-soft transition group text-left flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-ink-950 text-white grid place-items-center shrink-0">
                          <Smartphone size={18}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs uppercase tracking-wider text-ink-500 mb-0.5">{b.booking_ref}</p>
                          <p className="text-sm font-semibold text-ink-950 truncate">{b.device_brand} {b.device_model}</p>
                          <p className="text-xs text-ink-500 truncate">{b.issue || b.service_requested}</p>
                        </div>
                        <ChevronRight size={16} className="text-ink-400 group-hover:translate-x-1 transition"/>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!ticket && !error && !user && (
              <Reveal delay={0.1} className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stages.slice(0, 3).map((s, i) => {
                  const Icon = stageIcons[i] || Wrench;
                  return (
                    <div key={s.key} className="p-5 rounded-2xl bg-ink-50 border border-ink-100">
                      <div className="w-10 h-10 rounded-xl bg-white grid place-items-center text-brand mb-3">
                        <Icon size={18}/>
                      </div>
                      <p className="text-sm font-semibold text-ink-950">{s.label}</p>
                      <p className="text-xs text-ink-500 mt-1">{s.desc}</p>
                    </div>
                  );
                })}
              </Reveal>
            )}

            {!user && (
              <p className="mt-6 text-xs text-ink-500 text-center">
                Demo IDs: SM-2451 · SM-2469 · 07700900111
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function toTicket(row) {
  return {
    id: row.booking_ref,
    device: `${row.device_brand || ''} ${row.device_model || ''}`.trim() || '—',
    issue: row.issue || row.service_requested || 'Repair',
    customer: row.customer_name || '—',
    eta: row.requested_date ? new Date(row.requested_date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—',
    stage: row.stage ?? 0,
  };
}

function TicketDetail({ ticket }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-10 rounded-3xl bg-white border border-ink-100 shadow-soft-lg overflow-hidden"
    >
      <div className="p-6 lg:p-8 bg-gradient-to-br from-ink-950 to-ink-800 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-2">Repair ID</p>
            <p className="text-2xl font-bold">{ticket.id}</p>
          </div>
          <span className="pill bg-emerald-400/15 text-emerald-300 border border-emerald-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live status
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <Info label="Device" value={ticket.device}/>
          <Info label="Issue" value={ticket.issue}/>
          <Info label="ETA" value={ticket.eta}/>
        </div>
      </div>

      <div className="p-6 lg:p-10">
        <ol className="relative">
          {stages.map((s, i) => {
            const Icon = stageIcons[i] || Wrench;
            const completed = i < ticket.stage;
            const active = i === ticket.stage;
            return (
              <li key={s.key} className="relative pl-14 pb-8 last:pb-0">
                {i < stages.length - 1 && (
                  <div className={`absolute left-[18px] top-9 bottom-0 w-px ${completed ? 'bg-brand' : 'bg-ink-200'}`} />
                )}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 320, damping: 22 }}
                  className={`absolute left-0 top-0 w-9 h-9 rounded-full grid place-items-center ${
                    completed ? 'bg-brand text-white' : active ? 'bg-ink-950 text-white ring-4 ring-brand/30' : 'bg-ink-100 text-ink-400'
                  }`}
                >
                  <Icon size={16}/>
                </motion.div>
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h3 className={`text-base font-semibold ${active || completed ? 'text-ink-950' : 'text-ink-500'}`}>{s.label}</h3>
                  {completed && <span className="text-xs text-emerald-600 font-medium">Done</span>}
                  {active && <span className="text-xs text-brand font-medium">In progress</span>}
                </div>
                <p className={`text-sm leading-relaxed ${active || completed ? 'text-ink-600' : 'text-ink-400'}`}>{s.desc}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </motion.div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-white/55 mb-1">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
