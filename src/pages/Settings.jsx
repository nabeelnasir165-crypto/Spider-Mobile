import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Settings = () => {
  const [settings, setSettings] = useState({
    businessName: 'Spider Mobiles',
    supportEmail: 'hello@spidermobiles.co.uk',
    businessAddress: '835 Osmaston Road, Derby, United Kingdom',
    emailNotifications: true,
    smsAlerts: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('content')
        .eq('section_key', 'app_settings')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.content) {
        setSettings(data.content);
      }
    } catch (err) {
      console.error('Error fetching settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('cms_content').upsert({
        section_key: 'app_settings',
        content: settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'section_key' });
      
      if (error) throw error;
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err.message);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <main className="h-full overflow-y-auto p-md md:p-xl bg-background flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: '32px' }}>autorenew</span>
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
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>autorenew</span>
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
