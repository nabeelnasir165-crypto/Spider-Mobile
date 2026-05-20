import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ticketsWithCustomer } from '../data/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const Warranty = () => {
  const [tickets, setTickets] = useState(ticketsWithCustomer);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await Promise.race([
          supabase
            .from('tickets')
            .select('*, customers ( full_name )')
            .eq('status', 'Completed')
            .order('updated_at', { ascending: false }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
        ]);
        if (cancelled) return;
        if (error || !data || data.length === 0) return; // keep mock fallback
        setTickets(data);
      } catch (e) {
        console.warn('[admin] warranty fetch failed, using mock:', e?.message || e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const warranties = useMemo(() => {
    const now = new Date();
    return tickets
      .filter((t) => t.status === 'Completed')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .map((ticket) => {
        const completedDate = new Date(ticket.updated_at);
        const expiryDate = new Date(completedDate);
        expiryDate.setDate(expiryDate.getDate() + 90);
        const isExpired = now > expiryDate;
        return {
          ...ticket,
          expiry_date: expiryDate,
          warranty_status: isExpired ? 'Expired' : 'Active',
        };
      });
  }, [tickets]);

  const filteredWarranties = warranties.filter(w => {
    const searchMatch = !searchQuery || 
      w.ticket_ref.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (w.customers?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const statusMatch = !statusFilter || w.warranty_status.toLowerCase() === statusFilter.toLowerCase();
    
    return searchMatch && statusMatch;
  });

  const formatDate = (date) => {
    return date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Warranty Management</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Track active warranties and process warranty claims (90 days from completion).</p>
          </div>
          <div className="flex gap-sm">
            <Link to="/admin/new-ticket" className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-xs cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              File a Claim
            </Link>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col">
          <div className="p-md border-b border-outline-variant flex flex-wrap gap-md items-center bg-surface-bright rounded-t-xl">
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-xl pr-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                placeholder="Search by Ticket Ref or Customer..." 
                type="text" 
              />
            </div>
            <div className="flex flex-wrap gap-sm">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none pr-xl relative cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="claimed">Claimed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Ticket Ref</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Customer</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Device/Service</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Expiry Date</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Status</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-xl text-center text-on-surface-variant">Loading warranty records...</td>
                  </tr>
                ) : filteredWarranties.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-xl text-center text-on-surface-variant">No warranties found. Try completing some tickets!</td>
                  </tr>
                ) : (
                  filteredWarranties.map((row) => (
                    <tr key={row.id} className="hover:bg-surface transition-colors group">
                      <td className="py-md px-md font-code text-code text-primary">
                        <Link to={`/ticket/${row.ticket_ref}`} className="hover:underline">{row.ticket_ref}</Link>
                      </td>
                      <td className="py-md px-md font-medium text-on-surface">{row.customers?.full_name || 'Walk-in'}</td>
                      <td className="py-md px-md text-on-surface-variant">{row.device_brand} {row.device_model}</td>
                      <td className="py-md px-md font-medium text-on-surface">{formatDate(row.expiry_date)}</td>
                      <td className="py-md px-md">
                        <span className={`inline-flex items-center px-sm py-[2px] rounded-full font-label-md text-[11px] font-medium border border-outline-variant/20 ${row.warranty_status === 'Active' ? 'bg-success-container text-on-success-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                          {row.warranty_status}
                        </span>
                      </td>
                      <td className="py-md px-md text-right">
                        <Link to={`/ticket/${row.ticket_ref}`} className="inline-flex items-center gap-xs px-3 py-1 border border-outline-variant text-on-surface rounded font-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Warranty;
