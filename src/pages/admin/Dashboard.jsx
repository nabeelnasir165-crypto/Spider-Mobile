import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Users, Smartphone, TrendingUp, ChevronRight, ArrowUpRight, Loader2, Clock, ShieldCheck, CheckCircle2,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { stages } from '../../data/track';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - 6);

      const [all, today, pending, customers, recentRows] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday.toISOString()),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
        supabase.from('customer_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(6),
      ]);

      if (cancelled) return;
      setStats({
        total: all.count ?? 0,
        today: today.count ?? 0,
        pending: pending.count ?? 0,
        customers: customers.count ?? 0,
      });
      setRecent(recentRows.data || []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="py-24 grid place-items-center text-ink-500">
        <Loader2 className="animate-spin" size={28}/>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink-950 tracking-tight">Dashboard</h1>
        <p className="text-sm text-ink-600 mt-1.5">A live view of bookings, customers and repair flow.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-10">
        <StatCard icon={Calendar} label="Total bookings" value={stats.total} accent="brand"/>
        <StatCard icon={TrendingUp} label="Today" value={stats.today} accent="emerald"/>
        <StatCard icon={Clock} label="Pending" value={stats.pending} accent="amber"/>
        <StatCard icon={Users} label="Customers" value={stats.customers} accent="violet"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Recent bookings */}
        <div className="rounded-2xl bg-white border border-ink-100 shadow-soft overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-ink-100">
            <h2 className="text-base font-semibold text-ink-950">Recent bookings</h2>
            <Link to="/admin/bookings" className="text-xs font-semibold text-brand inline-flex items-center gap-1 hover:gap-1.5 transition-all">
              View all <ChevronRight size={13}/>
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-16 text-center">
              <Smartphone size={28} className="mx-auto text-ink-300 mb-3"/>
              <p className="text-sm text-ink-500">No bookings yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-ink-100">
              {recent.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-ink-50/50 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs uppercase tracking-wider text-ink-500">{b.booking_ref}</p>
                      <StagePill stage={b.stage ?? 0}/>
                    </div>
                    <p className="text-sm font-semibold text-ink-950 truncate">
                      {b.device_brand} {b.device_model}
                    </p>
                    <p className="text-xs text-ink-500 truncate">{b.issue || b.service_requested} · {b.customer_name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge status={b.status}/>
                    <p className="text-[10px] text-ink-400 mt-1.5">{timeAgo(b.created_at)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-ink-950 to-ink-800 text-white p-6">
            <ShieldCheck size={22} className="text-brand-light mb-3"/>
            <h3 className="font-semibold mb-1">Welcome, admin</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Update statuses, contact customers and keep the repair queue flowing from here.
            </p>
            <Link to="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-light hover:text-white transition">
              Open bookings <ArrowUpRight size={14}/>
            </Link>
          </div>

          <QuickCard icon={Calendar} title="Bookings queue" desc="See and update every repair." to="/admin/bookings"/>
          <QuickCard icon={Users} title="Customer list" desc="Search customers and their history." to="/admin/customers"/>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  const map = {
    brand: 'bg-accent-100 text-brand',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    violet: 'bg-violet-100 text-violet-700',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white border border-ink-100 shadow-soft p-5"
    >
      <div className={`w-10 h-10 rounded-xl ${map[accent]} grid place-items-center mb-4`}>
        <Icon size={18}/>
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-ink-500 font-semibold mb-1">{label}</p>
      <p className="text-2xl lg:text-3xl font-bold text-ink-950 tracking-tight">{value}</p>
    </motion.div>
  );
}

function QuickCard({ icon: Icon, title, desc, to }) {
  return (
    <Link to={to} className="block group rounded-2xl bg-white border border-ink-100 shadow-soft p-5 hover:border-ink-300 transition">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-ink-950 text-white grid place-items-center shrink-0 group-hover:bg-brand transition">
          <Icon size={17}/>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-ink-950">{title}</h4>
          <p className="text-xs text-ink-500 mt-0.5">{desc}</p>
        </div>
        <ChevronRight size={16} className="text-ink-300 group-hover:translate-x-1 transition"/>
      </div>
    </Link>
  );
}

export function StatusBadge({ status }) {
  const s = (status || 'Pending').toLowerCase();
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-sky-100 text-sky-800',
    converted: 'bg-emerald-100 text-emerald-800',
    ready: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-ink-100 text-ink-600',
  };
  return <span className={`pill text-[10px] ${map[s] || 'bg-ink-100 text-ink-700'}`}>{status || 'Pending'}</span>;
}

export function StagePill({ stage }) {
  const s = Math.max(0, Math.min(stages.length - 1, stage));
  return (
    <span className="inline-flex items-center gap-1 pill text-[10px] bg-ink-100 text-ink-700">
      {s === stages.length - 1 && <CheckCircle2 size={10} className="text-emerald-600"/>}
      {stages[s]?.label}
    </span>
  );
}

function timeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24);
  if (dd < 7) return `${dd}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
