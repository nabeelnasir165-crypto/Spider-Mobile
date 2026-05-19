import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Loader2, ChevronDown, X, Save, Phone, Mail, Smartphone, MessageSquare, Calendar, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { stages } from '../../data/track';
import { StatusBadge, StagePill } from './Dashboard';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Converted', 'Cancelled'];

export default function AdminBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data, error } = await Promise.race([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timed out after 12s. Check your Supabase URL/key and migrations.')), 12000)
        ),
      ]);
      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      setLoadError(e?.message || String(e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== 'all' && (r.status || 'Pending') !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        (r.booking_ref || '').toLowerCase().includes(q) ||
        (r.customer_name || '').toLowerCase().includes(q) ||
        (r.customer_email || '').toLowerCase().includes(q) ||
        (r.customer_phone || '').toLowerCase().includes(q) ||
        (r.device_brand || '').toLowerCase().includes(q) ||
        (r.device_model || '').toLowerCase().includes(q) ||
        (r.issue || '').toLowerCase().includes(q)
      );
    });
  }, [rows, statusFilter, query]);

  const updateBooking = async (id, patch) => {
    const { data, error } = await supabase
      .from('bookings')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      setRows((rs) => rs.map((r) => (r.id === id ? data : r)));
    }
    return { data, error };
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink-950 tracking-tight">Bookings</h1>
          <p className="text-sm text-ink-600 mt-1.5">{filtered.length} of {rows.length} bookings shown.</p>
        </div>
        <button onClick={load} className="btn-outline h-10 text-[13px] self-start">
          {loading ? <Loader2 className="animate-spin" size={14}/> : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white border border-ink-100 shadow-soft p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"/>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ref, customer, device, issue…"
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-ink-50 border border-ink-100 text-sm outline-none focus:border-ink-400 transition"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All</FilterButton>
            {STATUS_OPTIONS.map((s) => (
              <FilterButton key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>{s}</FilterButton>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-ink-500">
          <Loader2 className="animate-spin mx-auto" size={28}/>
          <p className="text-xs mt-3">Loading bookings…</p>
        </div>
      ) : loadError ? (
        <LoadErrorState message={loadError} onRetry={load}/>
      ) : filtered.length === 0 ? (
        <EmptyState query={query} statusFilter={statusFilter}/>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingRow
              key={b.id}
              b={b}
              open={openId === b.id}
              onToggle={() => setOpenId(openId === b.id ? null : b.id)}
              onUpdate={(patch) => updateBooking(b.id, patch)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-4 rounded-xl text-sm font-medium border transition ${
        active ? 'bg-ink-950 text-white border-ink-950' : 'bg-white text-ink-700 border-ink-200 hover:border-ink-400'
      }`}
    >
      {children}
    </button>
  );
}

function LoadErrorState({ message, onRetry }) {
  const lower = String(message).toLowerCase();
  let hint = null;
  if (lower.includes('does not exist') || lower.includes('relation')) {
    hint = 'Looks like a migration hasn\'t been run. Open Supabase → SQL Editor → run 20260519_customer_auth.sql and 20260521_admin_role.sql.';
  } else if (lower.includes('timed out') || lower.includes('fetch') || lower.includes('network')) {
    hint = 'Couldn\'t reach Supabase. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then restart the dev server.';
  } else if (lower.includes('permission') || lower.includes('rls')) {
    hint = 'Permission denied by RLS. Run the admin migration (20260521_admin_role.sql) and ensure your profile has is_admin = true.';
  }
  return (
    <div className="p-8 rounded-2xl bg-red-50 border border-red-100">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5"/>
        <div className="flex-1">
          <p className="font-semibold text-red-900">Couldn&rsquo;t load bookings</p>
          <p className="text-sm text-red-700 mt-1 font-mono break-words">{message}</p>
          {hint && <p className="text-sm text-red-700 mt-3">{hint}</p>}
          <button onClick={onRetry} className="mt-4 h-9 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition">
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query, statusFilter }) {
  const hasFilter = query || statusFilter !== 'all';
  return (
    <div className="py-16 text-center rounded-2xl bg-white border border-dashed border-ink-200">
      <Smartphone size={28} className="mx-auto text-ink-300 mb-3"/>
      <p className="font-semibold text-ink-950">No bookings {hasFilter ? 'match your filters' : 'yet'}</p>
      <p className="text-sm text-ink-500 mt-1">{hasFilter ? 'Clear filters to see everything.' : 'Bookings will appear here as customers create them.'}</p>
    </div>
  );
}

function BookingRow({ b, open, onToggle, onUpdate }) {
  return (
    <motion.div layout className="rounded-2xl bg-white border border-ink-100 shadow-soft overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 lg:p-5 text-left flex items-center gap-4 hover:bg-ink-50/40 transition"
      >
        <div className="w-10 h-10 rounded-xl bg-ink-950 text-white grid place-items-center shrink-0">
          <Smartphone size={17}/>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-xs uppercase tracking-wider text-ink-500">{b.booking_ref}</p>
            <StagePill stage={b.stage ?? 0}/>
          </div>
          <p className="text-sm font-semibold text-ink-950 truncate">{b.device_brand} {b.device_model} <span className="text-ink-500 font-normal">· {b.issue || b.service_requested}</span></p>
          <p className="text-xs text-ink-500 mt-0.5 truncate">
            {b.customer_name} · {b.customer_email || b.customer_phone}
          </p>
        </div>
        <div className="text-right shrink-0">
          <StatusBadge status={b.status}/>
          <p className="text-[10px] text-ink-400 mt-1.5">{new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
        </div>
        <ChevronDown size={16} className={`text-ink-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}/>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-ink-100 overflow-hidden"
          >
            <BookingDetail b={b} onUpdate={onUpdate}/>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BookingDetail({ b, onUpdate }) {
  const [status, setStatus] = useState(b.status || 'Pending');
  const [stage, setStage] = useState(b.stage ?? 0);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [err, setErr] = useState('');

  const save = async () => {
    setBusy(true); setErr('');
    const { error } = await onUpdate({ status, stage });
    setBusy(false);
    if (error) setErr(error.message);
    else setSavedAt(Date.now());
  };

  const requestedDate = b.requested_date ? new Date(b.requested_date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  const dirty = status !== (b.status || 'Pending') || stage !== (b.stage ?? 0);

  return (
    <div className="p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-ink-50/40">
      {/* Customer + booking info */}
      <div className="space-y-4">
        <DetailBlock title="Customer">
          <DetailRow icon={null} label="Name" value={b.customer_name || '—'} />
          <DetailRow icon={Mail} label="Email" value={b.customer_email || '—'} link={b.customer_email ? `mailto:${b.customer_email}` : undefined}/>
          <DetailRow icon={Phone} label="Phone" value={b.customer_phone || '—'} link={b.customer_phone ? `tel:${b.customer_phone}` : undefined}/>
        </DetailBlock>

        <DetailBlock title="Booking">
          <DetailRow icon={Calendar} label="Requested" value={requestedDate}/>
          <DetailRow icon={null} label="Created" value={new Date(b.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}/>
          {b.notes && (
            <div className="flex items-start gap-3 pt-1">
              <MessageSquare size={13} className="text-ink-400 mt-0.5"/>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ink-500 mb-0.5">Notes</p>
                <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">{b.notes}</p>
              </div>
            </div>
          )}
        </DetailBlock>
      </div>

      {/* Update form */}
      <div className="space-y-4">
        <DetailBlock title="Update status">
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-ink-500 font-semibold block mb-1.5">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-white border border-ink-200 text-sm outline-none focus:border-ink-950"
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-ink-500 font-semibold block mb-1.5">Repair stage</span>
            <div className="space-y-1.5">
              {stages.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setStage(i)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm border transition ${
                    i === stage
                      ? 'bg-ink-950 text-white border-ink-950'
                      : i < stage
                      ? 'bg-accent-50 border-accent-100 text-ink-900'
                      : 'bg-white border-ink-200 text-ink-700 hover:border-ink-400'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold grid place-items-center ${
                      i === stage ? 'bg-white text-ink-950' : i < stage ? 'bg-brand text-white' : 'bg-ink-100 text-ink-500'
                    }`}>{i < stage ? '✓' : i + 1}</span>
                    {s.label}
                  </span>
                  {i === stage && <span className="text-[10px] uppercase tracking-wider opacity-80">Current</span>}
                </button>
              ))}
            </div>
          </div>

          {err && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
              <AlertCircle size={15} className="mt-0.5"/> {err}
            </div>
          )}

          <button
            onClick={save}
            disabled={!dirty || busy}
            className={`btn-accent w-full h-10 text-[13px] disabled:opacity-60 disabled:cursor-not-allowed ${savedAt && Date.now() - savedAt < 2200 ? '!bg-emerald-500' : ''}`}
          >
            {busy ? <><Loader2 size={14} className="animate-spin"/> Saving…</>
              : (savedAt && Date.now() - savedAt < 2200) ? <><CheckCircle2 size={14}/> Saved</>
              : <><Save size={14}/> Save changes</>}
          </button>
        </DetailBlock>
      </div>
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div className="rounded-xl bg-white border border-ink-100 p-5 space-y-3">
      <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-500">{title}</p>
      {children}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, link }) {
  const content = (
    <p className="text-sm text-ink-900 font-medium">{value}</p>
  );
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 mt-0.5">{Icon ? <Icon size={13} className="text-ink-400"/> : null}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-ink-500 mb-0.5">{label}</p>
        {link ? <a href={link} className="text-sm text-brand hover:underline font-medium truncate block">{value}</a> : content}
      </div>
    </div>
  );
}
