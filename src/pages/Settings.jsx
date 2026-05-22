import React, { useState, useEffect } from 'react';
import { cmsContent } from '../data/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Skeleton } from '../components/Skeleton';

const Settings = () => {
  const [settings, setSettings] = useState({ ...cmsContent.app_settings });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content')
          .eq('section_key', 'app_settings')
          .maybeSingle();
        if (cancelled) return;
        if (!error && data?.content) setSettings({ ...settings, ...data.content });
      } catch (e) {
        console.warn('[admin] settings fetch failed, using mock:', e?.message || e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('cms_content').upsert(
          { section_key: 'app_settings', content: settings, updated_at: new Date().toISOString() },
          { onConflict: 'section_key' }
        );
        if (error) throw error;
        setIsSaving(false);
        alert('Settings saved.');
        return;
      } catch (e) {
        console.warn('[admin] settings save failed, falling back to local:', e?.message || e);
      }
    }
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved (local only — Supabase not reachable).');
    }, 350);
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <main aria-busy="true" className="h-full overflow-y-auto p-md md:p-xl bg-background">
        <div className="max-w-[800px] mx-auto">
          <Skeleton className="h-7 w-56 mb-xs" />
          <Skeleton className="h-4 w-80 mb-lg" />
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
            {Array.from({ length: 3 }).map((_, section) => (
              <div key={section} className="mb-lg last:mb-0">
                <Skeleton className="h-5 w-44 mb-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-9 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-container-max mx-auto max-w-[800px]">
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-background">Business Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Configure your business information and system preferences.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col p-lg gap-lg">
          <div>
            <h2 className="font-title-lg text-on-surface border-b border-outline-variant pb-xs mb-md">Business Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-on-surface-variant">Business Name</label>
                <input 
                  type="text" 
                  className="bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                  value={settings.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-on-surface-variant">Support Email</label>
                <input 
                  type="email" 
                  className="bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-xs md:col-span-2">
                <label className="font-label-md text-on-surface-variant">Business Address</label>
                <input 
                  type="text" 
                  className="bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                  value={settings.businessAddress}
                  onChange={(e) => handleChange('businessAddress', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-title-lg text-on-surface border-b border-outline-variant pb-xs mb-md">Notifications</h2>
            <div className="flex flex-col gap-sm">
              <label className="flex items-center gap-md cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary cursor-pointer" 
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <span className="font-body-md text-on-surface">Email notifications for new bookings</span>
              </label>
              <label className="flex items-center gap-md cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary cursor-pointer" 
                  checked={settings.smsAlerts}
                  onChange={(e) => handleChange('smsAlerts', e.target.checked)}
                />
                <span className="font-body-md text-on-surface">SMS alerts for customer ticket updates</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-md border-t border-outline-variant">
            <button 
              onClick={saveSettings}
              disabled={isSaving}
              className="px-lg py-2 bg-primary text-on-primary font-label-md rounded-lg hover:opacity-90 shadow-sm cursor-pointer disabled:opacity-70 flex items-center gap-sm"
            >
              {isSaving ? (
                <>
                  <span aria-hidden="true" className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>autorenew</span>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
