import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Mail, Phone, Users, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase
        .from('customer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: bookings } = await supabase
        .from('bookings')
        .select('customer_user_id');

      const counts = {};
      (bookings || []).forEach((b) => {
        if (b.customer_user_id) counts[b.customer_user_id] = (counts[b.customer_user_id] || 0) + 1;
      });

      setCustomers(profiles || []);
      setBookingCounts(counts);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter((c) =>
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink-950 tracking-tight">Customers</h1>
          <p className="text-sm text-ink-600 mt-1.5">{filtered.length} of {customers.length} customers shown.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-ink-100 shadow-soft p-4 mb-5">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"/>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-ink-50 border border-ink-100 text-sm outline-none focus:border-ink-400 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-ink-500">
          <Loader2 className="animate-spin mx-auto" size={28}/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white border border-dashed border-ink-200">
          <Users size={28} className="mx-auto text-ink-300 mb-3"/>
          <p className="font-semibold text-ink-950">{query ? 'No customers match' : 'No customers yet'}</p>
          <p className="text-sm text-ink-500 mt-1">{query ? 'Try a different search term.' : 'Customers will appear here as they sign up.'}</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-ink-100 shadow-soft overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-[1.6fr_2fr_1.4fr_0.8fr_0.6fr] gap-4 px-5 py-3 bg-ink-50 border-b border-ink-100 text-[11px] uppercase tracking-wider font-semibold text-ink-500">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Bookings</div>
            <div>Role</div>
          </div>
          <div className="divide-y divide-ink-100">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="px-5 py-4 sm:grid sm:grid-cols-[1.6fr_2fr_1.4fr_0.8fr_0.6fr] gap-4 sm:items-center hover:bg-ink-50/40 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-accent-700 grid place-items-center text-white font-semibold shrink-0">
                    {(c.full_name || c.email || '?').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-950 truncate">{c.full_name || '—'}</p>
                    <p className="text-[10px] text-ink-400">
                      joined {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="mt-2 sm:mt-0 min-w-0">
                  {c.email ? (
                    <a href={`mailto:${c.email}`} className="text-sm text-ink-800 hover:text-brand inline-flex items-center gap-1.5 truncate">
                      <Mail size={13} className="text-ink-400 shrink-0"/> <span className="truncate">{c.email}</span>
                    </a>
                  ) : <span className="text-sm text-ink-400">—</span>}
                </div>

                <div className="mt-1 sm:mt-0 min-w-0">
                  {c.phone ? (
                    <a href={`tel:${c.phone}`} className="text-sm text-ink-800 hover:text-brand inline-flex items-center gap-1.5">
                      <Phone size={13} className="text-ink-400"/> {c.phone}
                    </a>
                  ) : <span className="text-sm text-ink-400">—</span>}
                </div>

                <div className="mt-2 sm:mt-0">
                  <span className="pill text-[11px]">{bookingCounts[c.id] || 0}</span>
                </div>

                <div className="mt-2 sm:mt-0">
                  {c.is_admin ? (
                    <span className="inline-flex items-center gap-1 pill bg-accent-100 text-accent-800 text-[10px]">
                      <ShieldCheck size={10}/> Admin
                    </span>
                  ) : (
                    <span className="text-[11px] text-ink-400">Customer</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
