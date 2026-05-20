import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketsWithCustomer, bookings as mockBookings } from '../data/admin';

const Dashboard = () => {
  // Local mock data — replace with real DB queries when wiring Supabase back in
  const activeRepairs = ticketsWithCustomer.slice(0, 5);
  const metrics = {
    todaysRepairs: ticketsWithCustomer.filter((t) => sameDay(t.created_at, new Date())).length,
    revenueToday: ticketsWithCustomer
      .filter((t) => t.payment_status === 'Paid' && sameDay(t.created_at, new Date()))
      .reduce((sum, t) => sum + (t.estimated_price || 0), 0),
    pendingPayments: ticketsWithCustomer.filter((t) => t.payment_status === 'Unpaid').length,
    readyForPickup: ticketsWithCustomer.filter((t) => t.status === 'Ready').length,
    newBookings: mockBookings.filter((b) => b.status === 'Pending').length,
    overdueCount: ticketsWithCustomer.filter((t) => t.payment_status === 'Unpaid' && t.status === 'Completed').length,
    overdueAmount: ticketsWithCustomer
      .filter((t) => t.payment_status === 'Unpaid' && t.status === 'Completed')
      .reduce((sum, t) => sum + (t.estimated_price || 0), 0),
  };
  const loading = false;
  const [hideOverdueAlert, setHideOverdueAlert] = useState(false);

  function sameDay(iso, ref) {
    if (!iso) return false;
    const d = new Date(iso);
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success-container text-on-success-container';
      case 'repairing':
      case 'in progress':
        return 'bg-warning-container text-on-warning-container';
      case 'diagnosed':
        return 'bg-primary-container text-on-primary-container';
      default:
        return 'bg-surface-container-highest text-on-surface-variant';
    }
  };

  const getPaymentColor = (paymentStatus) => {
    return paymentStatus?.toLowerCase() === 'paid' 
      ? 'bg-surface-container-highest text-on-surface'
      : 'bg-error-container text-on-error-container';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <main className="bg-background p-lg w-full min-h-full">
      <div className="max-w-container-max mx-auto flex flex-col xl:flex-row gap-xl h-full">
        <div className="flex-1 flex flex-col gap-lg">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Overview</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Here's what's happening with your repairs today.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-md">
            {[
              { label: 'Today’s Repairs', icon: 'build', value: metrics.todaysRepairs, color: 'primary' },
              { label: 'Revenue Today', icon: 'payments', value: `£${metrics.revenueToday.toFixed(2)}`, color: 'primary' },
              { label: 'Pending Payments', icon: 'credit_card', value: metrics.pendingPayments, color: 'tertiary-container', barColor: 'bg-tertiary-container' },
              { label: 'Ready for Pickup', icon: 'shopping_bag', value: metrics.readyForPickup, color: 'primary' },
              { label: 'New Bookings', icon: 'calendar_today', value: metrics.newBookings, color: 'primary' }
            ].map((card, index) => (
              <div key={index} className="bg-surface-container-lowest border border-outline-variant rounded-xl px-md py-5 flex flex-col relative overflow-hidden group shadow-sm">
                <div className="flex justify-between items-start mb-sm">
                  <span className="font-label-md text-label-md text-on-surface-variant">{card.label}</span>
                  <span className={`material-symbols-outlined text-${card.color} opacity-60`} data-icon={card.icon} style={{ fontSize: '22px' }}>{card.icon}</span>
                </div>
                <span className="text-[28px] font-bold leading-tight text-on-surface mt-auto">{card.value}</span>
                <div className={`absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${card.barColor || 'bg-primary'}`}></div>
              </div>
            ))}
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h2 className="font-title-lg text-title-lg text-on-surface">Active Repairs</h2>
              <Link to="/admin/repairs" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-xs">
                View All <span className="material-symbols-outlined" data-icon="arrow_forward" style={{ fontSize: '16px' }}>arrow_forward</span>
              </Link>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Ticket ID</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Customer Name</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Device</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Payment</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Date</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-md text-body-md text-on-surface bg-surface-container-lowest">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-md text-center text-on-surface-variant">Loading active repairs...</td>
                    </tr>
                  ) : activeRepairs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-md text-center text-on-surface-variant">No active repairs found.</td>
                    </tr>
                  ) : (
                    activeRepairs.map((row) => (
                      <tr key={row.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-md font-code text-code text-primary">{row.ticket_ref}</td>
                        <td className="p-md font-medium">{row.customers?.full_name || 'Unknown'}</td>
                        <td className="p-md text-on-surface-variant">{row.device_brand} {row.device_model}</td>
                        <td className="p-md">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full font-label-md text-label-md text-[11px] ${getStatusColor(row.status)}`}>{row.status}</span>
                        </td>
                        <td className="p-md">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full font-label-md text-label-md text-[11px] ${getPaymentColor(row.payment_status)}`}>{row.payment_status || 'Unpaid'}</span>
                        </td>
                        <td className="p-md text-on-surface-variant">{formatDate(row.created_at)}</td>
                        <td className="p-md text-right">
                          <Link to={`/ticket/${row.ticket_ref.replace('#', '')}`} className="font-label-md text-label-md text-primary bg-surface border border-outline-variant shadow-sm px-3 py-1.5 rounded-lg hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">View</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-[320px] flex flex-col gap-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col">
            <div className="p-md border-b border-outline-variant bg-surface-bright flex items-center gap-sm">
              <span className="material-symbols-outlined text-tertiary-container" data-icon="warning">warning</span>
              <h3 className="font-title-lg text-title-lg text-on-surface">Alerts</h3>
            </div>
            <div className="p-md flex flex-col gap-md bg-surface-container-lowest">
              {metrics.overdueCount > 0 ? (
                !hideOverdueAlert && (
                  <div className="relative w-full">
                    <Link to="/admin/repairs" className="flex items-start gap-md p-md rounded-xl bg-error-container border-2 border-error hover:opacity-90 transition-opacity cursor-pointer w-full shadow-sm pr-12">
                      <div className="bg-error w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <span className="material-symbols-outlined text-on-error" style={{ fontSize: '24px' }}>error</span>
                      </div>
                      <div>
                        <h4 className="font-title-md text-title-md font-bold text-on-error-container">{metrics.overdueCount} Unpaid Completed {metrics.overdueCount === 1 ? 'Repair' : 'Repairs'}</h4>
                        <p className="font-body-md text-body-md text-on-error-container mt-1">Totaling £{metrics.overdueAmount.toFixed(2)}. Click here to resolve.</p>
                      </div>
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setHideOverdueAlert(true);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-on-error-container/70 hover:text-on-error-container hover:bg-error/10 transition-colors cursor-pointer"
                      aria-label="Dismiss alert"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                    </button>
                  </div>
                )
              ) : (
                <div className="flex items-start gap-sm p-sm rounded bg-success-container/20 border border-success-container">
                  <span className="material-symbols-outlined text-success mt-0.5" data-icon="check_circle" style={{ fontSize: '18px' }}>check_circle</span>
                  <div>
                    <h4 className="font-label-md text-label-md font-bold text-on-surface">No Overdue Payments</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-[13px] mt-0.5">All completed repairs have been paid.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col">
            <div className="p-md border-b border-outline-variant bg-surface-bright flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary" data-icon="bolt">bolt</span>
              <h3 className="font-title-lg text-title-lg text-on-surface">Quick Actions</h3>
            </div>
            <div className="p-md flex flex-col gap-sm bg-surface-container-lowest">
              <Link to="/admin/new-ticket" className="w-full flex items-center gap-sm justify-center bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg hover:shadow-md hover:opacity-90 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                New Repair Ticket
              </Link>
              <Link to="/admin/customers" className="w-full flex items-center gap-sm justify-center bg-surface text-on-surface font-label-md text-label-md py-sm rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Add Customer
              </Link>
              <Link to="/admin/repairs" className="w-full flex items-center gap-sm justify-center bg-surface text-on-surface font-label-md text-label-md py-sm rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-[20px]">search</span>
                Search Repairs
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24"></div>
    </main>
  );
};

export default Dashboard;
