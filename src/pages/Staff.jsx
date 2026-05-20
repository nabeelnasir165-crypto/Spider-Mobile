import React, { useState, useEffect } from 'react';
import { staff as mockStaff } from '../data/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const sortByName = (list) =>
  [...list].sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));

const Staff = () => {
  const [staffList, setStaffList] = useState(sortByName(mockStaff));
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Pull live staff from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await Promise.race([
          supabase.from('staff').select('*').order('full_name'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
        ]);
        if (cancelled) return;
        if (error || !data || data.length === 0) return; // keep mock fallback
        setStaffList(sortByName(data));
      } catch (e) {
        console.warn('[admin] staff fetch failed, using mock:', e?.message || e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    // Optimistic update
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s)));
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('staff').update({ is_active: !currentStatus }).eq('id', id);
    } catch (e) {
      console.warn('[admin] staff toggle failed:', e?.message || e);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleAddStaff = () => {
    alert("In a production environment, this would open a modal to invite a new user via email and link them to Supabase Auth.");
  };

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Staff Management</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage your technicians and front desk staff.</p>
          </div>
          <div className="flex gap-sm">
            <button onClick={handleAddStaff} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-xs cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add Staff Member
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: '32px' }}>autorenew</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {staffList.map((staff) => (
              <div key={staff.id} className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col items-center text-center gap-sm transition-opacity ${!staff.is_active ? 'opacity-60' : ''}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-headline-md font-bold mb-xs ${staff.role === 'Admin' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface'}`}>
                  {getInitials(staff.full_name)}
                </div>
                <div>
                  <h3 className="font-title-lg font-bold text-on-surface flex items-center justify-center gap-xs">
                    {staff.full_name}
                    {!staff.is_active && <span className="material-symbols-outlined text-error text-[16px]" title="Inactive">person_off</span>}
                  </h3>
                  <p className="font-label-md text-primary font-medium">{staff.role}</p>
                </div>
                <p className="font-body-md text-on-surface-variant mt-xs">{staff.email}</p>
                <div className="mt-md w-full flex gap-sm">
                  <button onClick={() => alert('Role editing coming soon.')} className="flex-1 py-sm border border-outline-variant rounded text-on-surface font-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                    Edit
                  </button>
                  <button 
                    onClick={() => toggleStatus(staff.id, staff.is_active)}
                    className={`flex-1 py-sm border rounded font-label-md transition-colors cursor-pointer ${
                      staff.is_active 
                      ? 'border-outline-variant text-error hover:bg-error-container/20' 
                      : 'border-success text-success hover:bg-success-container/20'
                    }`}
                  >
                    {staff.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Staff;
