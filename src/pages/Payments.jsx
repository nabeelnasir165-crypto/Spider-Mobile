import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Payments = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Metrics state
  const [metrics, setMetrics] = useState({
    revenueToday: 0,
    outstanding: 0,
    revenueThisMonth: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          ticket_ref,
          created_at,
          estimated_price,
          payment_status,
          customer_id,
          customers ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const allTickets = data || [];
      setTickets(allTickets);
      
      // Calculate Metrics
      const now = new Date();
      const todayString = now.toISOString().split('T')[0];
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      let revToday = 0;
      let outstd = 0;
      let revMonth = 0;

      allTickets.forEach(t => {
        const price = parseFloat(t.estimated_price) || 0;
        const isPaid = t.payment_status?.toLowerCase() === 'paid';
        const createdAt = new Date(t.created_at);
        const dateString = createdAt.toISOString().split('T')[0];

        if (!isPaid) {
          outstd += price;
        } else {
          if (dateString === todayString) revToday += price;
          if (createdAt.toISOString() >= startOfMonth) revMonth += price;
        }
      });

      setMetrics({
        revenueToday: revToday,
        outstanding: outstd,
        revenueThisMonth: revMonth
      });

    } catch (err) {
      console.error('Error fetching payments:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (!statusFilter) return true;
    return (t.payment_status?.toLowerCase() || 'unpaid') === statusFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Financials & Payments</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Track paid/unpaid repairs, view invoices, and manage revenue.</p>
          </div>
          <div className="flex gap-sm">
            <Link to="/new-ticket" className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-xs cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Create Ticket / Invoice
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs uppercase tracking-wider">Revenue Today</p>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">£{metrics.revenueToday.toFixed(2)}</h3>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs uppercase tracking-wider">Outstanding (Unpaid)</p>
            <h3 className="font-headline-lg text-headline-lg text-error">£{metrics.outstanding.toFixed(2)}</h3>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs uppercase tracking-wider">Revenue This Month</p>
            <h3 className="font-headline-lg text-headline-lg text-primary">£{metrics.revenueThisMonth.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col">
          <div className="p-md border-b border-outline-variant flex flex-wrap gap-md items-center bg-surface-bright rounded-t-xl">
            <h2 className="font-title-lg text-title-lg text-on-surface flex-1">Recent Invoices</h2>
            <div className="flex flex-wrap gap-sm">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none pr-xl relative cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Invoice #</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Date</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Customer</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Ticket Ref</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap text-right">Amount</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap">Status</th>
                  <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-xl text-center text-on-surface-variant">Loading financials...</td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-xl text-center text-on-surface-variant">No records found.</td>
                  </tr>
                ) : (
                  filteredTickets.map((row) => (
                    <tr key={row.id} className="hover:bg-surface transition-colors group">
                      <td className="py-md px-md font-code text-code text-primary">INV-{row.ticket_ref?.split('-')[1] || '000'}</td>
                      <td className="py-md px-md text-on-surface-variant">{formatDate(row.created_at)}</td>
                      <td className="py-md px-md font-medium text-on-surface">{row.customers?.full_name || 'Walk-in'}</td>
                      <td className="py-md px-md text-on-surface-variant">{row.ticket_ref}</td>
                      <td className="py-md px-md text-right font-bold text-on-surface">£{(parseFloat(row.estimated_price) || 0).toFixed(2)}</td>
                      <td className="py-md px-md">
                        <span className={`inline-flex items-center px-sm py-[2px] rounded-full font-label-md text-[11px] font-medium border border-outline-variant/20 ${row.payment_status?.toLowerCase() === 'paid' ? 'bg-success-container text-on-success-container' : 'bg-error-container text-on-error-container'}`}>
                          {row.payment_status || 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-md px-md text-right">
                        <Link to={`/ticket/${row.ticket_ref?.replace('#', '')}`} className="inline-flex items-center gap-xs px-3 py-1.5 border border-outline-variant text-on-surface rounded font-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                          View
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

export default Payments;
