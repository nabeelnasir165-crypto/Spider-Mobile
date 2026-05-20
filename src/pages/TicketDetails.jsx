import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ticketsWithCustomer, ticketNotes as mockNotes } from '../data/admin';

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const [deliveryInfo, setDeliveryInfo] = useState({ courierName: '', status: 'Not Dispatched' });
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);

  const [partsConsumed, setPartsConsumed] = useState([]);
  const [newPartName, setNewPartName] = useState('');

  const statuses = [
    'Booked', 'Received', 'Diagnosed', 'Repairing',
    'Ready for Collection', 'Completed', 'Returned Unrepaired', 'Abandoned (Lost Job)',
  ];

  useEffect(() => {
    setLoading(true);
    const found = ticketsWithCustomer.find((t) => t.ticket_ref === id);
    if (found) {
      setTicket(found);
      if (found.delivery_info) setDeliveryInfo(found.delivery_info);
      if (found.parts_consumed) setPartsConsumed(found.parts_consumed);
      setNotes(
        mockNotes
          .filter((n) => n.ticket_id === found.id)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
    }
    setLoading(false);
  }, [id]);

  // Local-only mutations
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: 'n-' + Math.random().toString(36).slice(2, 8),
      ticket_id: ticket.id,
      author: 'You',
      content: newNote,
      is_status_update: false,
      created_at: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
    setNewNote('');
  };

  const handleUpdateStatus = () => {
    if (!selectedStatus) return;
    setTicket((prev) => ({ ...prev, status: selectedStatus }));
    setNotes((prev) => [
      {
        id: 'n-' + Math.random().toString(36).slice(2, 8),
        ticket_id: ticket.id,
        author: 'System',
        content: `Status updated to ${selectedStatus}`,
        is_status_update: true,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setIsStatusModalOpen(false);
  };

  const handleMarkAsPaid = () => {
    setTicket((prev) => ({ ...prev, payment_status: 'Paid' }));
    setNotes((prev) => [
      {
        id: 'n-' + Math.random().toString(36).slice(2, 8),
        ticket_id: ticket.id,
        author: 'System',
        content: 'Payment marked as Paid',
        is_status_update: true,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleUpdateDelivery = () => {
    setIsSavingDelivery(true);
    setTimeout(() => {
      setIsSavingDelivery(false);
      alert('Delivery info updated (local only).');
    }, 250);
  };

  const handleAddPart = () => {
    if (!newPartName.trim()) return;
    const updatedParts = [...partsConsumed, { name: newPartName, date: new Date().toISOString() }];
    setPartsConsumed(updatedParts);
    setNotes((prev) => [
      {
        id: 'n-' + Math.random().toString(36).slice(2, 8),
        ticket_id: ticket.id,
        author: 'System',
        content: `Part consumed: ${newPartName}`,
        is_status_update: true,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewPartName('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="material-symbols-outlined animate-spin text-[40px] text-primary">sync</span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-md">
        <h2 className="font-headline-md text-headline-md text-on-surface">Ticket not found</h2>
        <Link to="/admin/repairs" className="text-primary hover:underline">Return to Repairs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg lg:px-xl py-lg">
      {/* Header Section */}
      <header className="mb-lg">
        <Link to="/admin/repairs" className="inline-flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors mb-md font-label-md text-label-md">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Repairs
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div className="flex items-center gap-md">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
              {ticket.ticket_ref}
            </h1>
            <span className="inline-flex items-center gap-xs bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md px-sm py-xs rounded-full">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-primary"></span>
              {ticket.status || 'Booked'}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <button className="font-label-md text-label-md px-md py-sm rounded border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer">
              Edit Ticket
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Left Column: Primary Details & Timeline (Spans 8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Customer & Device Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Customer Card */}
            <div className="bg-surface border border-outline-variant rounded-lg p-md">
              <div className="flex items-center justify-between border-b border-outline-variant pb-sm mb-sm">
                <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                  Customer Details
                </h2>
              </div>
              <div className="flex flex-col gap-sm mt-md">
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Name</p>
                  <p className="font-body-md text-body-md text-on-surface">{ticket.customers?.full_name}</p>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Contact</p>
                  <p className="font-body-md text-body-md text-on-surface">{ticket.customers?.email}</p>
                  <p className="font-body-md text-body-md text-on-surface">{ticket.customers?.phone}</p>
                </div>
              </div>
            </div>
            {/* Device Card */}
            <div className="bg-surface border border-outline-variant rounded-lg p-md">
              <div className="flex items-center justify-between border-b border-outline-variant pb-sm mb-sm">
                <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">smartphone</span>
                  Device Details
                </h2>
              </div>
              <div className="flex flex-col gap-sm mt-md">
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Model</p>
                  <p className="font-body-md text-body-md text-on-surface font-semibold">{ticket.device_brand} {ticket.device_model}</p>
                </div>
                <div className="grid grid-cols-2 gap-sm">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Passcode</p>
                    <p className="font-code text-code text-on-surface bg-surface-container-low px-sm py-xs rounded inline-block">{ticket.device_passcode || 'None'}</p>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-xs">IMEI/Serial</p>
                    <p className="font-code text-code text-on-surface">{ticket.device_imei || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Repair Timeline Section */}
          <section className="bg-surface border border-outline-variant rounded-lg p-md lg:p-lg">
            <h2 className="font-title-lg text-title-lg text-on-surface mb-md">Reported Issues & Condition</h2>
            <div className="flex flex-col gap-md">
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Issues</h3>
                <div className="flex flex-wrap gap-xs">
                  {ticket.reported_issues?.map(issue => (
                    <span key={issue} className="px-sm py-xs bg-error-container text-on-error-container rounded-lg text-sm">{issue}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Condition / Accessories</h3>
                <p className="font-body-md text-body-md text-on-surface">
                  Checklist: {JSON.stringify(ticket.condition_checklist)} <br/>
                  Accessories: {ticket.accessories_received?.join(', ') || 'None'}
                </p>
              </div>
            </div>
          </section>

          {/* Parts Consumption Log */}
          <section className="bg-surface border border-outline-variant rounded-lg p-md lg:p-lg">
            <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">build</span>
              Parts Consumed
            </h2>
            <div className="flex flex-col gap-md">
              <div className="flex gap-sm">
                <input 
                  type="text" 
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="flex-1 bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-md text-on-surface focus:border-primary outline-none" 
                  placeholder="e.g. iPhone 13 Screen OLED" 
                />
                <button onClick={handleAddPart} className="bg-primary-container text-on-primary-container px-md py-sm rounded font-label-md hover:opacity-90 transition-colors">
                  Log Part
                </button>
              </div>
              <ul className="flex flex-col gap-xs">
                {partsConsumed.map((part, i) => (
                  <li key={i} className="flex justify-between items-center p-sm bg-surface-container-low rounded">
                    <span className="font-body-md text-on-surface">{part.name}</span>
                    <span className="font-label-md text-on-surface-variant text-[12px]">{new Date(part.date).toLocaleString()}</span>
                  </li>
                ))}
                {partsConsumed.length === 0 && <span className="text-sm text-on-surface-variant">No parts logged yet.</span>}
              </ul>
            </div>
          </section>

          {/* Technician Notes Panel */}
          <section className="bg-surface border border-outline-variant rounded-lg p-md lg:p-lg flex flex-col gap-md">
            <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">comment</span>
              Technician Notes
            </h2>
            <div className="flex flex-col gap-sm">
              <textarea 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow min-h-[80px]" 
                placeholder="Add a diagnostic note or status update..."
              ></textarea>
              <div className="flex justify-end">
                <button onClick={handleAddNote} className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded hover:bg-on-primary-fixed-variant transition-colors cursor-pointer">
                  Add Note
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-sm mt-sm border-t border-surface-variant pt-md">
              {notes.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No notes yet.</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-surface-container-low rounded p-sm">
                    <div className="flex items-center justify-between mb-xs">
                      <span className="font-label-md text-label-md font-bold text-on-surface">{note.author}</span>
                      <span className="font-label-md text-label-md text-on-surface-variant">{new Date(note.created_at).toLocaleString()}</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Summary & Actions (Spans 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Quick Actions Block */}
          <div className="bg-surface border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface mb-xs border-b border-outline-variant pb-sm">Quick Actions</h2>
            <button onClick={() => { setSelectedStatus(ticket.status || 'Booked'); setIsStatusModalOpen(true); }} className="w-full flex items-center gap-sm justify-center bg-surface-container text-on-surface font-label-md text-label-md py-sm rounded border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">update</span>
              Update Status
            </button>
            <button onClick={() => alert('Image upload feature coming soon!')} className="w-full flex items-center gap-sm justify-center bg-surface-container text-on-surface font-label-md text-label-md py-sm rounded border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              Upload Image
            </button>
            <button onClick={() => window.print()} className="w-full flex items-center gap-sm justify-center bg-surface-container text-on-surface font-label-md text-label-md py-sm rounded border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">print</span>
              Print Job Sheet
            </button>
          </div>

          {/* Payment Summary */}
          <div className="bg-surface border border-outline-variant rounded-lg p-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm mb-md">
              <h2 className="font-title-lg text-title-lg text-on-surface">Payment Summary</h2>
              <span className={`font-label-md text-label-md px-xs py-[2px] rounded uppercase tracking-wider text-[10px] ${ticket.payment_status?.toLowerCase() === 'paid' ? 'bg-success-container text-on-success-container' : 'bg-error-container text-on-error-container'}`}>
                {ticket.payment_status}
              </span>
            </div>
            <div className="flex flex-col gap-sm mb-md">
              <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                <span>Estimated Price</span>
                <span>£{ticket.estimated_price?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t border-surface-variant pt-sm mt-xs flex justify-between items-center font-title-lg text-title-lg text-on-surface">
                <span>Total Due</span>
                <span>£{ticket.estimated_price?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            {ticket.payment_status?.toLowerCase() !== 'paid' && (
              <button onClick={handleMarkAsPaid} className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-sm cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                Mark as Paid
              </button>
            )}
          </div>

          {/* Delivery & Dispatch Tracking */}
          <div className="bg-surface border border-outline-variant rounded-lg p-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm mb-md">
              <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">local_shipping</span> Delivery Tracking</h2>
            </div>
            <div className="flex flex-col gap-sm">
              <div>
                <label className="font-label-md text-on-surface-variant">Courier / Driver Name</label>
                <input 
                  type="text" 
                  value={deliveryInfo.courierName}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, courierName: e.target.value })}
                  className="w-full mt-xs bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-md text-on-surface focus:border-primary outline-none" 
                  placeholder="e.g. John Doe (Internal) or DPD" 
                />
              </div>
              <div>
                <label className="font-label-md text-on-surface-variant">Status</label>
                <select 
                  value={deliveryInfo.status}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, status: e.target.value })}
                  className="w-full mt-xs bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-md text-on-surface focus:border-primary outline-none cursor-pointer"
                >
                  <option value="Not Dispatched">Not Dispatched</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed Attempt">Failed Attempt</option>
                </select>
              </div>
              <button 
                onClick={handleUpdateDelivery}
                disabled={isSavingDelivery}
                className="w-full mt-sm bg-surface-container text-on-surface font-label-md py-sm rounded border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                {isSavingDelivery ? 'Saving...' : 'Save Delivery Info'}
              </button>
            </div>
          </div>

          {/* Warranty Status */}
          <div className="bg-surface border border-outline-variant rounded-lg p-md flex items-start gap-md">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-secondary-fixed">verified</span>
            </div>
            <div>
              <h3 className="font-label-md text-label-md font-bold text-on-surface mb-xs">Warranty Protection</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                This repair will include a standard <strong>90-Day Parts & Labor Warranty</strong> upon completion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-lg w-full max-w-[400px] shadow-lg border border-outline-variant">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-title-lg text-title-lg text-on-surface">Update Ticket Status</h2>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-sm mb-lg">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full text-left px-md py-sm rounded border transition-colors cursor-pointer ${
                    selectedStatus === status 
                      ? 'bg-primary-container text-on-primary-container border-primary font-semibold' 
                      : 'bg-surface text-on-surface border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            
            <div className="flex justify-end gap-sm">
              <button onClick={() => setIsStatusModalOpen(false)} className="px-md py-sm rounded border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low cursor-pointer">
                Cancel
              </button>
              <button onClick={handleUpdateStatus} className="px-md py-sm rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant cursor-pointer">
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
