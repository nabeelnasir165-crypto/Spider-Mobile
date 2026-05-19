import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const NewRepairTicket = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    powersOn: false
  });
  const [accessories, setAccessories] = useState(['Case']);
  
  const [estimatedPrice, setEstimatedPrice] = useState(45.00);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const fromBooking = location.state?.fromBooking;
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    if (fromBooking) {
      setAdditionalNotes(`Booking Ref: ${fromBooking.booking_ref}\nService Requested: ${fromBooking.service_requested}`);
      setSearchQuery(fromBooking.customer_name || fromBooking.customer_email || '');
      setBookingId(fromBooking.id);
    }
  }, [fromBooking]);

  // Customer search
  useEffect(() => {
    if (searchQuery.length > 2) {
      searchCustomers(searchQuery);
    } else {
      setCustomers([]);
    }
  }, [searchQuery]);

  const searchCustomers = async (query) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(5);
        
      if (error) {
        console.error("Supabase search error:", error);
      }
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }
    
    setLoading(true);
    try {
      // Create a ticket ref
      const ref = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          ticket_ref: ref,
          customer_id: selectedCustomer.id,
          device_brand: deviceBrand,
          device_model: deviceModel,
          device_imei: deviceImei,
          device_passcode: devicePasscode,
          reported_issues: reportedIssues,
          condition_checklist: conditionChecklist,
          accessories_received: accessories,
          estimated_price: estimatedPrice,
          status: 'Booked'
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // If there are notes, insert them
      if (additionalNotes) {
        await supabase.from('ticket_notes').insert([{
          ticket_id: data.id,
          author: 'System Admin',
          content: additionalNotes
        }]);
      }
      
      // Update booking status if converted from a booking
      if (bookingId) {
        await supabase.from('bookings').update({ status: 'Converted' }).eq('id', bookingId);
      }
      
      // Navigate to the ticket details page
      navigate(`/ticket/${data.ticket_ref}`);
    } catch (err) {
      console.error(err);
      alert("Error creating ticket: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-lg lg:p-xl max-w-container-max mx-auto w-full">
      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">Create Repair Ticket</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Log a new device for assessment and repair.</p>
      </div>

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
                    {customers.length > 0 ? (
                      customers.map(c => (
                        <div 
                          key={c.id} 
                          className="p-sm hover:bg-surface-container-low cursor-pointer border-b border-outline-variant last:border-0"
                          onClick={() => { setSelectedCustomer(c); setSearchQuery(''); setCustomers([]); }}
                        >
                          <p className="font-bold text-on-surface">{c.full_name}</p>
                          <p className="text-on-surface-variant text-sm">{c.email} | {c.phone}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-sm text-center text-on-surface-variant">
                        No customer found. <button onClick={() => navigate('/customers')} className="text-primary hover:underline ml-xs cursor-pointer">Create new</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-surface-container-low border border-primary/30 rounded-lg p-md flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-title-lg text-title-lg">
                    {selectedCustomer.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-title-lg text-title-lg text-on-surface text-[14px]">{selectedCustomer.full_name}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">{selectedCustomer.phone || 'No phone'} • {selectedCustomer.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-on-surface-variant hover:text-error transition-colors p-sm cursor-pointer">
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
