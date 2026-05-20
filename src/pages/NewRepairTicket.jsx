import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { customers as mockCustomers } from '../data/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Map booking.issue / booking.service_requested → known reported issue label
const issueAliases = {
  'screen': 'Screen Damage',
  'screen damage': 'Screen Damage',
  'screen replacement': 'Screen Damage',
  'screen repair': 'Screen Damage',
  'battery': 'Battery Drain',
  'battery drain': 'Battery Drain',
  'battery swap': 'Battery Drain',
  'battery replacement': 'Battery Drain',
  'charging port': 'Charging Port',
  'charging': 'Charging Port',
  'camera': 'Camera Lens',
  'camera lens': 'Camera Lens',
  'water': 'Water Damage',
  'water damage': 'Water Damage',
  'speaker': 'Speaker / Mic',
  'speaker / mic': 'Speaker / Mic',
  'mic': 'Speaker / Mic',
  'back glass': 'Back Glass',
  'diagnostics': 'Diagnostics',
};
const normaliseIssue = (raw) => {
  if (!raw) return null;
  const key = String(raw).toLowerCase().trim();
  return issueAliases[key] || raw;
};

const NewRepairTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromBooking = location.state?.fromBooking;

  // State for form fields
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [deviceBrand, setDeviceBrand] = useState('Apple');
  const [deviceModel, setDeviceModel] = useState('iPhone 13 Pro');
  const [deviceImei, setDeviceImei] = useState('');
  const [devicePasscode, setDevicePasscode] = useState('');

  const [reportedIssues, setReportedIssues] = useState(['Battery Drain']);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [conditionChecklist, setConditionChecklist] = useState({
    scratches: false,
    dents: false,
    powersOn: false,
  });
  const [accessories, setAccessories] = useState(['Case']);

  const [estimatedPrice, setEstimatedPrice] = useState(45.0);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Live customer pool: local mock + Supabase customer_profiles (when configured)
  const [livePool, setLivePool] = useState(mockCustomers);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await Promise.race([
          supabase.from('customer_profiles').select('*'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 6000)),
        ]);
        if (cancelled || !data) return;
        const normalised = data.map((p) => ({
          id: p.id,
          full_name: p.full_name || p.email?.split('@')[0] || 'Unknown',
          email: p.email || '',
          phone: p.phone || '',
        }));
        // De-dupe by email
        const byEmail = new Map();
        [...mockCustomers, ...normalised].forEach((c) => {
          if (c.email) byEmail.set(c.email.toLowerCase(), c);
        });
        setLivePool([...byEmail.values()]);
      } catch (e) {
        console.warn('[admin] customer pool fetch failed, using mock:', e?.message || e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Auto-fill from booking on mount
  useEffect(() => {
    if (!fromBooking) return;

    setBookingId(fromBooking.id);
    setAdditionalNotes(
      `Converted from booking ${fromBooking.booking_ref}\n` +
      `Service requested: ${fromBooking.service_requested || fromBooking.issue || '—'}`
    );

    // Device prefill (real bookings carry device_brand/device_model; mock ones don't)
    if (fromBooking.device_brand) setDeviceBrand(fromBooking.device_brand);
    if (fromBooking.device_model) setDeviceModel(fromBooking.device_model);

    // Issue prefill
    const issueLabel = normaliseIssue(fromBooking.issue || fromBooking.service_requested);
    if (issueLabel) setReportedIssues([issueLabel]);

    // Customer match — by email first, then phone
    const wantedEmail = (fromBooking.customer_email || '').toLowerCase();
    const wantedPhone = (fromBooking.customer_phone || '').replace(/\s+/g, '');
    let match =
      livePool.find((c) => c.email && c.email.toLowerCase() === wantedEmail) ||
      livePool.find((c) => c.phone && c.phone.replace(/\s+/g, '') === wantedPhone);

    if (match) {
      setSelectedCustomer(match);
    } else {
      // No existing customer — draft one from the booking
      setSelectedCustomer({
        id: 'draft-' + Math.random().toString(36).slice(2, 8),
        full_name: fromBooking.customer_name || 'New customer',
        email: fromBooking.customer_email || '',
        phone: fromBooking.customer_phone || '',
        is_draft: true, // marker so the UI can show "(will be created)"
      });
    }
  }, [fromBooking, livePool]);

  // Customer search uses the live pool
  useEffect(() => {
    if (searchQuery.length > 2) {
      const q = searchQuery.toLowerCase();
      setSearchResults(
        livePool
          .filter(
            (c) =>
              (c.full_name || '').toLowerCase().includes(q) ||
              (c.email || '').toLowerCase().includes(q) ||
              (c.phone || '').includes(q)
          )
          .slice(0, 5)
      );
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, livePool]);

  const toggleIssue = (issue) => {
    setReportedIssues(prev => 
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  const toggleAccessory = (acc) => {
    setAccessories(prev => 
      prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert('Please select a customer first.');
      return;
    }

    setLoading(true);
    // Local-only creation — no Supabase. In the demo, "create" just shows
    // a success message and goes back to the repairs list (the new ticket
    // isn't persisted since we're not pushing to the in-memory store yet).
    const ref = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    setTimeout(() => {
      setLoading(false);
      alert(`Ticket ${ref} created (demo only — not persisted).`);
      navigate('/admin/repairs');
    }, 350);
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-lg lg:p-xl max-w-container-max mx-auto w-full">
      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">Create Repair Ticket</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Log a new device for assessment and repair.</p>
      </div>

      {/* Banner shown when admin came here via "Convert to Ticket" from a booking */}
      {fromBooking && (
        <div className="mb-lg bg-primary-container/15 border border-primary/30 rounded-lg p-md flex items-start gap-sm">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>auto_fix_high</span>
          <div className="flex-1">
            <p className="font-title-lg text-title-lg text-on-surface text-[14px]">
              Pre-filled from booking <span className="font-code text-primary">{fromBooking.booking_ref}</span>
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant text-[12px] mt-xs">
              Customer, device and issue have been auto-filled from the booking. Review the form below — change anything that's wrong, then create the ticket.
            </p>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md mb-lg shadow-sm relative z-0">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-[2px] bg-surface-container-high -z-10 -translate-y-1/2"></div>
          {/* Step 1 (Active) */}
          <div className="flex flex-col items-center gap-xs bg-surface-container-lowest px-sm relative z-10">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold ring-4 ring-surface-container-lowest">1</div>
            <span className="font-label-md text-label-md text-primary hidden md:block">Customer</span>
          </div>
          <div className="flex flex-col items-center gap-xs bg-surface-container-lowest px-sm relative z-10">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-bold ring-4 ring-surface-container-lowest">2</div>
            <span className="font-label-md text-label-md text-on-surface-variant hidden md:block">Device</span>
          </div>
          <div className="flex flex-col items-center gap-xs bg-surface-container-lowest px-sm relative z-10">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-bold ring-4 ring-surface-container-lowest">3</div>
            <span className="font-label-md text-label-md text-on-surface-variant hidden md:block">Issues</span>
          </div>
          <div className="flex flex-col items-center gap-xs bg-surface-container-lowest px-sm relative z-10">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-bold ring-4 ring-surface-container-lowest">4</div>
            <span className="font-label-md text-label-md text-on-surface-variant hidden md:block">Checklist</span>
          </div>
          <div className="flex flex-col items-center gap-xs bg-surface-container-lowest px-sm relative z-10">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-bold ring-4 ring-surface-container-lowest">5</div>
            <span className="font-label-md text-label-md text-on-surface-variant hidden md:block">Summary</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column (Main Form) */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Customer Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md border-b border-surface-container-high pb-sm">
              <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">person</span>
                Customer Details
              </h2>
              <button className="text-primary font-label-md text-label-md hover:underline cursor-pointer">Create New</button>
            </div>
            
            {!selectedCustomer ? (
              <div className="relative w-full mb-md">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                  className="w-full bg-surface border border-outline-variant rounded-lg py-sm pl-xl pr-md text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="Search by name, phone, or email..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery.length > 2 && (
                  <div className="absolute z-50 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg">
                    {searchResults.length > 0 ? (
                      searchResults.map(c => (
                        <div
                          key={c.id}
                          className="p-sm hover:bg-surface-container-low cursor-pointer border-b border-outline-variant last:border-0"
                          onClick={() => { setSelectedCustomer(c); setSearchQuery(''); setSearchResults([]); }}
                        >
                          <p className="font-bold text-on-surface">{c.full_name}</p>
                          <p className="text-on-surface-variant text-sm">{c.email} | {c.phone}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-sm text-center text-on-surface-variant">
                        No customer found. <button onClick={() => navigate('/admin/customers')} className="text-primary hover:underline ml-xs cursor-pointer">Create new</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-surface-container-low border border-primary/30 rounded-lg p-md flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-title-lg text-title-lg">
                    {(selectedCustomer.full_name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-sm flex-wrap">
                      <p className="font-title-lg text-title-lg text-on-surface text-[14px]">{selectedCustomer.full_name}</p>
                      {selectedCustomer.is_draft && (
                        <span className="inline-flex items-center gap-xs px-2 py-[2px] rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold uppercase tracking-wider">
                          New — will be created
                        </span>
                      )}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">{selectedCustomer.phone || 'No phone'} • {selectedCustomer.email || 'No email'}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-on-surface-variant hover:text-error transition-colors p-sm cursor-pointer" title="Clear selection">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>

          {/* Device Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md border-b border-surface-container-high pb-sm">
              <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">smartphone</span>
                Device Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Brand</label>
                <select 
                  className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                  value={deviceBrand}
                  onChange={(e) => setDeviceBrand(e.target.value)}
                >
                  <option>Apple</option>
                  <option>Samsung</option>
                  <option>Google</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Model</label>
                <input 
                  className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="e.g. iPhone 13 Pro" 
                  type="text"
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant pl-xs">IMEI / Serial Number</label>
                <input 
                  className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="Enter 15-digit IMEI" 
                  type="text"
                  value={deviceImei}
                  onChange={(e) => setDeviceImei(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Passcode / Pattern</label>
                <input 
                  className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="Leave blank if none" 
                  type="text"
                  value={devicePasscode}
                  onChange={(e) => setDevicePasscode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Problem Selection */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md border-b border-surface-container-high pb-sm">
              <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">bug_report</span>
                Reported Issues
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
              {[
                { id: 'Screen Damage', icon: 'broken_image' },
                { id: 'Battery Drain', icon: 'battery_alert' },
                { id: 'Charging Port', icon: 'power' },
                { id: 'Water Damage', icon: 'water_drop' }
              ].map((issue) => (
                <label 
                  key={issue.id} 
                  className={`flex flex-col items-center justify-center p-sm border rounded-lg cursor-pointer transition-colors ${reportedIssues.includes(issue.id) ? 'bg-primary-fixed border-primary' : 'border-outline-variant hover:bg-surface-container-low'}`}
                >
                  <input 
                    className="sr-only" 
                    type="checkbox" 
                    checked={reportedIssues.includes(issue.id)}
                    onChange={() => toggleIssue(issue.id)}
                  />
                  <span className={`material-symbols-outlined mb-xs ${reportedIssues.includes(issue.id) ? 'text-primary' : 'text-on-surface-variant'}`}>{issue.icon}</span>
                  <span className={`font-label-md text-label-md text-center ${reportedIssues.includes(issue.id) ? 'text-primary font-bold' : ''}`}>{issue.id}</span>
                </label>
              ))}
            </div>
            <div className="mt-md flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Additional Notes</label>
              <textarea 
                className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" 
                placeholder="Describe the issue in detail..." 
                rows="3"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column (Condition, Estimates, Save) */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Pre-Repair Condition */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="mb-md border-b border-surface-container-high pb-sm">
              <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">fact_check</span>
                Condition Checklist
              </h2>
            </div>
            <div className="flex flex-col gap-sm">
              {Object.keys(conditionChecklist).map((key) => (
                <label key={key} className="flex items-center gap-md p-sm border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low">
                  <input 
                    className="form-checkbox h-4 w-4 text-primary border-outline-variant rounded-sm focus:ring-primary" 
                    type="checkbox"
                    checked={conditionChecklist[key]}
                    onChange={(e) => setConditionChecklist({...conditionChecklist, [key]: e.target.checked})}
                  />
                  <span className="font-body-md text-body-md flex-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
            <div className="mt-md pt-md border-t border-surface-container-high">
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">Accessories Received</h3>
              <div className="flex flex-wrap gap-sm">
                {['SIM Tray', 'Case', 'Charger'].map((acc) => (
                  <span 
                    key={acc}
                    onClick={() => toggleAccessory(acc)}
                    className={`px-md py-xs border rounded-full font-label-md text-label-md cursor-pointer transition-colors ${accessories.includes(acc) ? 'border-primary bg-primary-fixed text-on-primary-fixed' : 'border-outline-variant bg-surface text-on-surface hover:bg-surface-container-low'}`}
                  >
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Estimate & Actions */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg shadow-sm sticky top-24">
            <h2 className="font-title-lg text-title-lg text-on-surface mb-md">Summary & Estimate</h2>
            <div className="flex justify-between items-center mb-sm">
              <span className="font-body-md text-body-md text-on-surface-variant">Estimated Repair Cost</span>
              <input 
                type="number" 
                className="w-24 bg-surface border border-outline-variant rounded py-xs px-sm text-right font-body-md focus:border-primary focus:outline-none" 
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-between items-center mb-md">
              <span className="font-body-md text-body-md text-on-surface-variant">Diagnostic Fee</span>
              <span className="font-body-md text-body-md text-on-surface">£0.00</span>
            </div>
            <div className="flex justify-between items-center pt-md border-t border-outline-variant mb-lg">
              <span className="font-title-lg text-title-lg font-bold text-on-surface">Total Estimate</span>
              <span className="font-headline-md text-headline-md font-bold text-primary">£{estimatedPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-md">
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full bg-primary text-on-primary font-title-lg text-title-lg rounded-lg py-md px-lg flex items-center justify-center gap-sm hover:bg-on-primary-fixed-variant transition-colors shadow-sm cursor-pointer disabled:opacity-70"
              >
                <span className="material-symbols-outlined">save</span>
                {loading ? 'Saving...' : 'Create Ticket'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24"></div>
    </main>
  );
};

export default NewRepairTicket;
