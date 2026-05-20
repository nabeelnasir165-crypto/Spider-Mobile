import React, { useState, useEffect } from 'react';
import { customers as mockCustomers } from '../data/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getStoredCustomers } from '../lib/localStore';

const sortByCreated = (list) =>
  [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

const dedupeByEmail = (list) => {
  const byEmail = new Map();
  list.forEach((c) => {
    const key = (c.email || c.id || '').toLowerCase();
    if (!byEmail.has(key)) byEmail.set(key, c);
  });
  return [...byEmail.values()];
};

const CustomerDatabase = () => {
  // Start with mock + any locally-saved customer drafts so the UI is never empty.
  const [customers, setCustomers] = useState(
    sortByCreated(dedupeByEmail([...getStoredCustomers(), ...mockCustomers]))
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Pull real customer signups from Supabase's customer_profiles table.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await Promise.race([
          supabase.from('customer_profiles').select('*').order('created_at', { ascending: false }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 8000)
          ),
        ]);
        if (cancelled) return;
        if (error || !data) return;          // keep mock data as fallback
        if (data.length === 0) return;       // empty table → keep mock for demo
        // Map customer_profiles rows to the shape the UI expects.
        const normalised = data.map((p) => ({
          id: p.id,
          full_name: p.full_name || p.email?.split('@')[0] || 'Unknown',
          email: p.email || '',
          phone: p.phone || '',
          address: '',
          is_business_account: false,
          notes: p.marketing_opt_in ? 'Marketing opted-in' : '',
          created_at: p.created_at,
        }));
        setCustomers(sortByCreated(dedupeByEmail([...getStoredCustomers(), ...normalised, ...mockCustomers])));
      } catch (e) {
        // Silently fall back to mock — surfaces in console only.
        console.warn('[admin] customer_profiles fetch failed, using mock:', e?.message || e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  // Form State
  const [newCustomer, setNewCustomer] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    is_business_account: false,
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsAddingCustomer(false);
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.full_name) {
      alert("Full Name is required");
      return;
    }
    
    setSaving(true);
    // Local-only add: prepend to in-memory list (not persisted across reloads)
    const created = {
      ...newCustomer,
      id: 'c' + Math.random().toString(36).slice(2, 9),
      created_at: new Date().toISOString(),
    };
    setCustomers((prev) => [created, ...prev]);
    setSelectedCustomer(created);
    setIsAddingCustomer(false);
    setNewCustomer({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      is_business_account: false,
      notes: '',
    });
    setSaving(false);
  };

  const filteredCustomers = customers.filter(c => 
    (c.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  );

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Customer Database</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage customer profiles, history, and communications.</p>
          </div>
          <div className="flex gap-sm">
            <button 
              onClick={() => { setIsAddingCustomer(true); setSelectedCustomer(null); }}
              className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-xs shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add Customer
            </button>
            <button className="px-md py-sm rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-xs cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          
          {/* Left Column: Customer List */}
          <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col h-[calc(100vh-200px)]">
            <div className="p-md border-b border-outline-variant bg-surface-bright rounded-t-xl">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                  className="w-full h-10 pl-xl pr-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                  placeholder="Search customers..." 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-lg flex justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-lg text-center text-on-surface-variant">
                  No customers found.
                </div>
              ) : (
                <ul className="divide-y divide-outline-variant/50">
                  {filteredCustomers.map((c) => (
                    <li 
                      key={c.id}
                      onClick={() => handleSelectCustomer(c)}
                      className={`p-md hover:bg-surface transition-colors cursor-pointer border-l-4 ${selectedCustomer?.id === c.id ? 'border-primary bg-primary-container/10' : 'border-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-xs">
                        <h3 className="font-title-lg text-[15px] font-bold text-on-surface">{c.full_name}</h3>
                        {c.is_business_account && (
                          <span className="bg-tertiary-container text-on-tertiary-container text-[10px] uppercase tracking-wider px-xs py-[2px] rounded font-bold">B2B</span>
                        )}
                      </div>
                      <p className="font-body-md text-on-surface-variant text-[13px]">{c.email}</p>
                      <p className="font-body-md text-on-surface-variant text-[13px]">{c.phone}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column: Customer Details or Add Form */}
          <div className="lg:col-span-8 flex flex-col gap-lg h-[calc(100vh-200px)] overflow-y-auto pr-sm custom-scrollbar">
            {isAddingCustomer ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
                <div className="border-b border-outline-variant pb-md flex justify-between items-center">
                  <h2 className="font-headline-md font-bold text-on-surface flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary">person_add</span>
                    Create New Customer
                  </h2>
                  <button onClick={() => setIsAddingCustomer(false)} className="text-on-surface-variant hover:text-error transition-colors p-sm cursor-pointer">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Full Name *</label>
                    <input 
                      className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary outline-none" 
                      placeholder="e.g. John Smith" 
                      value={newCustomer.full_name}
                      onChange={(e) => setNewCustomer({...newCustomer, full_name: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Email</label>
                    <input 
                      className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary outline-none" 
                      placeholder="john@example.com"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Phone</label>
                    <input 
                      className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary outline-none" 
                      placeholder="+44 7700..."
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Address</label>
                    <input 
                      className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary outline-none" 
                      placeholder="123 Main St, London"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    />
                  </div>
                </div>
                
                <label className="flex items-center gap-sm mt-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded-sm border-outline-variant"
                    checked={newCustomer.is_business_account}
                    onChange={(e) => setNewCustomer({...newCustomer, is_business_account: e.target.checked})}
                  />
                  <span className="font-body-md">This is a business (B2B) account</span>
                </label>
                
                <div className="flex flex-col gap-xs mt-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant pl-xs">Notes (Internal)</label>
                  <textarea 
                    className="w-full bg-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary outline-none resize-none" 
                    rows="3" 
                    placeholder="Any specific customer requirements..."
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end gap-sm mt-md pt-md border-t border-outline-variant">
                  <button 
                    onClick={() => setIsAddingCustomer(false)}
                    className="px-lg py-sm border border-outline-variant text-on-surface rounded font-label-md hover:bg-surface-container-low transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateCustomer}
                    disabled={saving || !newCustomer.full_name}
                    className="px-lg py-sm bg-primary text-on-primary rounded font-label-md hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-xs shadow-sm"
                  >
                    {saving ? 'Saving...' : 'Save Customer'}
                  </button>
                </div>
              </div>
            ) : selectedCustomer ? (
              <>
                {/* Profile Header */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col md:flex-row gap-md items-start md:items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
                  
                  <div className="flex items-center gap-lg">
                    <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-lg font-bold">
                      {selectedCustomer.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-xs flex items-center gap-sm">
                        {selectedCustomer.full_name}
                        {selectedCustomer.is_business_account && (
                          <span className="material-symbols-outlined text-tertiary text-[20px]" title="Business Account">domain</span>
                        )}
                      </h2>
                      <div className="flex items-center gap-md text-on-surface-variant font-body-md">
                        <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">mail</span> {selectedCustomer.email || 'N/A'}</span>
                        <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">call</span> {selectedCustomer.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-sm w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-md py-sm bg-primary text-on-primary rounded font-label-md hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
                      New Ticket
                    </button>
                    <button className="flex-1 md:flex-none px-md py-sm border border-outline-variant rounded text-on-surface font-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                      Edit
                    </button>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="bg-surface border border-outline-variant rounded-lg p-md">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Address & Info</h3>
                    <p className="font-body-md text-on-surface whitespace-pre-line">
                      {selectedCustomer.address || 'No address provided.'}
                    </p>
                    {selectedCustomer.notes && (
                      <div className="mt-sm pt-sm border-t border-outline-variant/50">
                        <p className="font-body-md text-on-surface-variant italic">"{selectedCustomer.notes}"</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-surface border border-outline-variant rounded-lg p-md">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Customer Metrics</h3>
                    <div className="grid grid-cols-2 gap-md">
                      <div>
                        <p className="font-headline-md font-bold text-primary">0</p>
                        <p className="font-label-md text-on-surface-variant">Total Repairs</p>
                      </div>
                      <div>
                        <p className="font-headline-md font-bold text-on-surface">£0.00</p>
                        <p className="font-label-md text-on-surface-variant">Lifetime Value</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Repair History */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
                  <div className="p-md border-b border-outline-variant bg-surface-bright flex justify-between items-center">
                    <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Repair History</h3>
                  </div>
                  <div className="p-lg text-center text-on-surface-variant font-body-md">
                    No repairs found for this customer yet.
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm flex flex-col items-center justify-center text-center h-full text-on-surface-variant">
                <span className="material-symbols-outlined text-[64px] mb-md opacity-20">person_search</span>
                <h2 className="font-title-lg font-bold text-on-surface mb-xs">No Customer Selected</h2>
                <p className="font-body-md">Select a customer from the list on the left to view their profile, history, and details.</p>
                <button 
                  onClick={() => setIsAddingCustomer(true)}
                  className="mt-lg px-lg py-sm bg-primary text-on-primary rounded font-label-md hover:opacity-90 transition-opacity"
                >
                  Create New Customer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CustomerDatabase;
