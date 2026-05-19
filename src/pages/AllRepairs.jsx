import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AllRepairs = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('last30');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          customers (
            full_name,
            email,
            phone,
            is_business_account
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success-container text-on-success-container border-success/20';
      case 'repairing':
      case 'in progress':
        return 'bg-warning-container text-on-warning-container border-warning/20';
      case 'diagnosed':
        return 'bg-primary-container text-on-primary-container border-primary/20';
      case 'abandoned':
        return 'bg-error-container text-on-error-container border-error/20 opacity-75';
      case 'returned unrepaired':
        return 'bg-surface-variant text-on-surface-variant border-outline-variant';
      default:
        return 'bg-surface-container-highest text-on-surface-variant border-outline-variant';
    }
  };

  const getPaymentDot = (paymentStatus) => {
    return paymentStatus?.toLowerCase() === 'paid' ? 'bg-success' : 'bg-outline';
  };

  // Date helper
  const getStartDate = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Export CSV handler
  const handleExportCSV = () => {
    const header = ['Ticket ID', 'Customer', 'Phone', 'Device', 'Issues', 'Status', 'Price', 'Payment'];
    const rows = filteredTickets.map(t => [
      t.ticket_ref,
      t.customers?.full_name || 'Unknown',
      t.customers?.phone || '',
      `${t.device_brand} ${t.device_model}`,
      (t.reported_issues || []).join('; '),
      t.status,
      t.estimated_price ? `£${t.estimated_price.toFixed(2)}` : 'TBD',
      t.payment_status || 'Unpaid'
    ]);
    const csvContent = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repair_tickets_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Apply filters
  const filteredTickets = tickets.filter(row => {
    const searchMatch = !searchQuery || 
      row.ticket_ref.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (row.customers?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.customers?.phone || '').includes(searchQuery);
      
    const statusMatch = !statusFilter || row.status?.toLowerCase() === statusFilter.toLowerCase();
    const paymentMatch = !paymentFilter || row.payment_status?.toLowerCase() === paymentFilter.toLowerCase();
    
    let dateMatch = true;
    if (dateFilter === 'last30') {
      dateMatch = new Date(row.created_at) >= getStartDate(30);
    } else if (dateFilter === 'last7') {
      dateMatch = new Date(row.created_at) >= getStartDate(7);
    } else if (dateFilter === 'today') {
      const today = new Date();
      const created = new Date(row.created_at);
      dateMatch = created.toDateString() === today.toDateString();
    } else if (dateFilter === 'custom' && customStart && customEnd) {
      const created = new Date(row.created_at);
      dateMatch = created >= new Date(customStart) && created <= new Date(customEnd + 'T23:59:59');
    }
    
    return searchMatch && statusMatch && paymentMatch && dateMatch;
  });

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Repair Tickets</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage active repairs, update statuses, and process collections.</p>
          </div>
          <div className="flex gap-sm">
            <button 
              onClick={handleExportCSV}
              className="px-md py-sm rounded-lg border border-outline-variant text-primary font-label-md text-label-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col">
          <div className="p-md border-b border-outline-variant flex flex-wrap gap-md items-center bg-surface-bright rounded-t-xl">
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="w-full h-10 pl-xl pr-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                placeholder="Search by Ticket ID or Customer..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-sm">
              <select 
                className="h-10 px-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none pr-xl relative cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="diagnosed">Diagnosed</option>
                <option value="repairing">Repairing</option>
                <option value="completed">Completed</option>
                <option value="returned unrepaired">Returned Unrepaired</option>
                <option value="abandoned">Abandoned (Lost Job)</option>
              </select>
              <select 
                className="h-10 px-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none pr-xl cursor-pointer"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">Payment Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <div className="relative">
                <select 
                  className="h-10 px-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none pr-xl cursor-pointer"
                  value={dateFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDateFilter(val);
                    if (val === 'custom') setIsCalendarOpen(true);
                  }}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="custom">Custom Range…</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Ticket ID</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Customer</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Device</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Status</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap text-right">Price</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Payment</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-xl text-on-surface-variant">
                      <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-xl text-on-surface-variant">
                      No tickets found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((row) => (
                    <tr key={row.id} className="hover:bg-surface transition-colors group">
                      <td className="py-md px-md font-code text-code text-on-surface-variant">
                        <Link to={`/ticket/${row.ticket_ref}`} className="hover:text-primary transition-colors">{row.ticket_ref}</Link>
                      </td>
                      <td className="py-md px-md">
                        <div className="font-medium text-on-surface">{row.customers?.full_name || 'Unknown'}</div>
                        <div className="text-on-surface-variant text-[12px]">{row.customers?.is_business_account ? 'B2B Account' : (row.customers?.phone || row.customers?.email)}</div>
                      </td>
                      <td className="py-md px-md">
                        {row.device_brand} {row.device_model} <br/>
                        <span className="text-on-surface-variant text-[12px]">{row.reported_issues?.join(', ') || 'No issues listed'}</span>
                      </td>
                      <td className="py-md px-md">
                        <span className={`inline-flex items-center px-sm py-[2px] rounded-full font-label-md text-[11px] font-medium border ${getStatusColor(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className={`py-md px-md text-right font-medium ${!row.estimated_price ? 'text-on-surface-variant' : ''}`}>
                        {row.estimated_price ? `£${row.estimated_price.toFixed(2)}` : 'TBD'}
                      </td>
                      <td className="py-md px-md">
                        <span className="inline-flex items-center gap-xs text-on-surface-variant text-[12px]">
                          <span className={`w-2 h-2 rounded-full ${getPaymentDot(row.payment_status)}`}></span> {row.payment_status}
                        </span>
                      </td>
                      <td className="py-md px-md text-right">
                        <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/ticket/${row.ticket_ref}`} className="p-xs rounded text-primary hover:bg-primary-container/20 transition-colors" title="View Details">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </Link>
                          <Link to={`/ticket/${row.ticket_ref}`} className="p-xs rounded text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer" title="Edit">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-sm border-t border-outline-variant flex items-center justify-between bg-surface-bright rounded-b-xl">
            <span className="font-label-md text-label-md text-on-surface-variant px-sm">Showing {filteredTickets.length} entries</span>
            <div className="flex gap-xs">
              <button className="p-xs rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="p-xs rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AllRepairs;
