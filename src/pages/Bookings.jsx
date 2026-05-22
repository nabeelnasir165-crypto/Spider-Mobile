import React, { useState, useEffect } from 'react';
import { SkeletonRow } from '../components/Skeleton';
import { Link } from 'react-router-dom';
import { bookings as mockBookings } from '../data/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { applyBookingOverrides } from '../lib/localStore';

const sortByRequested = (list) =>
  [...list].sort((a, b) => new Date(a.requested_date) - new Date(b.requested_date));

const Bookings = () => {
  // Start with the mock list (with any local status overrides applied) so
  // the UI is never empty while Supabase resolves.
  const [bookings, setBookings] = useState(
    sortByRequested(applyBookingOverrides(mockBookings))
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Re-apply overrides when window regains focus (e.g. after creating a ticket
  // in another tab and coming back to /admin/bookings).
  useEffect(() => {
    const refresh = () => setBookings((prev) => applyBookingOverrides(prev));
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('last30');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Pull real bookings from Supabase. Customers create these via the /book page.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await Promise.race([
          supabase.from('bookings').select('*').order('requested_date', { ascending: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
        ]);
        if (cancelled) return;
        if (error || !data || data.length === 0) return;  // keep mock fallback
        setBookings(sortByRequested(applyBookingOverrides(data)));
      } catch (e) {
        console.warn('[admin] bookings fetch failed, using mock:', e?.message || e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Helpers — defined before they're used in filteredBookings below.
  const getStartDate = () => {
    const now = new Date();
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-success-container text-on-success-container';
      case 'converted': return 'bg-surface-variant text-on-surface-variant';
      default: return 'bg-warning-container text-on-warning-container'; // Pending
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = (b.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (b.booking_ref?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? b.status?.toLowerCase() === statusFilter.toLowerCase() : true;
    let matchesDate = true;
    if (dateFilter === 'last30') {
      const start = getStartDate();
      const bookingDate = new Date(b.requested_date);
      matchesDate = bookingDate >= start;
    } else if (dateFilter === 'custom' && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      const bookingDate = new Date(b.requested_date);
      matchesDate = bookingDate >= start && bookingDate <= end;
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Website Bookings</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage online appointment requests and convert them to repair tickets.</p>
          </div>
            <div className="flex gap-sm items-center">
              {/* Calendar Button */}
              <button
                className="px-md py-sm rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center gap-xs cursor-pointer"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">calendar_month</span>
                Calendar View
              </button>

            {/* Calendar Modal */}
            {isCalendarOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-30" onClick={() => setIsCalendarOpen(false)}>
                <div className="bg-surface-container-high rounded-lg shadow-lg border border-outline-variant p-4" onClick={e => e.stopPropagation()}>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Start Date</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full h-9 px-2 rounded border border-outline-variant bg-surface-container-lowest text-body-md"
                    />
                    <label className="font-label-sm text-label-sm text-on-surface-variant">End Date</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full h-9 px-2 rounded border border-outline-variant bg-surface-container-lowest text-body-md"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        className="px-sm py-1 rounded bg-primary text-on-primary hover:bg-primary/90"
                        onClick={() => {
                          setDateFilter('custom');
                          setIsCalendarOpen(false);
                        }}
                      >
                        Apply
                      </button>
                      <button
                        className="px-sm py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
                        onClick={() => setIsCalendarOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

              {/* Date Filter Select */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 px-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none pr-xl cursor-pointer"
              >
                <option value="last30">Last 30 Days</option>
                <option value="all">All Dates</option>
                <option value="custom">Custom Range</option>
              </select>

              {/* Export CSV */}
              <button
                onClick={() => {
                  const header = ['Booking Ref', 'Customer', 'Requested Date', 'Service', 'Status'];
                  const rows = filteredBookings.map(b => [
                    b.booking_ref,
                    b.customer_name,
                    new Date(b.requested_date).toISOString().split('T')[0],
                    b.service_requested,
                    b.status
                  ]);
                  const csvContent = [header, ...rows].map(r => r.join(',')).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `bookings_${Date.now()}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-md py-sm rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center gap-xs cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">download</span>
                Export CSV
              </button>
            </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col">
          <div className="p-md border-b border-outline-variant flex flex-wrap gap-md items-center bg-surface-bright rounded-t-xl">
            <div className="relative flex-1 min-w-[200px]">
              <span aria-hidden="true" className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-xl pr-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                placeholder="Search by customer name or reference..." 
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
                <option value="pending">Pending Confirmation</option>
                <option value="confirmed">Confirmed</option>
                <option value="converted">Converted to Ticket</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Booking Ref</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Customer</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Requested Date/Time</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Service</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Status</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} cells={6} widths={['w-20', 'w-3/4', 'w-32', 'w-24', 'w-16', 'w-24']}/>
                  ))
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-xl text-center text-on-surface-variant">No bookings found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredBookings.map((row) => (
                    <tr key={row.id} className={`hover:bg-surface transition-colors group ${row.status?.toLowerCase() === 'converted' ? 'opacity-70' : ''}`}>
                      <td className="py-md px-md font-code text-code text-primary">{row.booking_ref}</td>
                      <td className="py-md px-md">
                        <div className="font-medium text-on-surface">{row.customer_name}</div>
                        <div className="text-on-surface-variant text-[12px]">{row.customer_phone}</div>
                      </td>
                      <td className="py-md px-md font-medium text-on-surface">{formatDate(row.requested_date)}</td>
                      <td className="py-md px-md text-on-surface-variant">{row.service_requested}</td>
                      <td className="py-md px-md">
                        <span className={`inline-flex items-center px-sm py-[2px] rounded-full font-label-md text-[11px] font-medium border border-outline-variant/20 ${getStatusColor(row.status)}`}>
                          {row.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-md px-md text-right">
                        {row.status?.toLowerCase() !== 'converted' ? (
                          <Link to="/admin/new-ticket" state={{ fromBooking: row }} className="inline-flex items-center gap-xs px-3 py-1.5 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary/90 transition-colors cursor-pointer shadow-sm">
                            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">receipt_long</span>
                            Convert to Ticket
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-xs px-3 py-1.5 text-on-surface-variant rounded font-label-md text-label-md">
                            Converted
                          </span>
                        )}
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

export default Bookings;
