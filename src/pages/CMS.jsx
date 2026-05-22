import React, { useState, useEffect } from 'react';
import { cmsContent } from '../data/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const CMS = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState({
    homepage_hero: cmsContent.homepage_hero,
    faqs: cmsContent.faqs,
    promotions: cmsContent.promotions,
    contact: cmsContent.contact,
    inventory: cmsContent.inventory,
  });

  // Hydrate from cms_content table on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('section_key, content');
        if (cancelled || error || !data?.length) return;
        setContent((prev) => {
          const next = { ...prev };
          data.forEach((row) => {
            if (row.section_key && row.section_key in next) {
              next[row.section_key] = row.content;
            }
          });
          return next;
        });
      } catch (e) {
        console.warn('[admin] CMS fetch failed, using mock:', e?.message || e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const tabs = [
    { id: 'homepage', label: 'Homepage Editor', icon: 'home' },
    { id: 'faq', label: 'FAQs', icon: 'quiz' },
    { id: 'promotions', label: 'Promotions', icon: 'campaign' },
    { id: 'contact', label: 'Contact Settings', icon: 'contact_page' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory_2' }
  ];

  const saveCMS = async () => {
    setIsSaving(true);
    if (isSupabaseConfigured) {
      try {
        const rows = Object.entries(content).map(([section_key, value]) => ({
          section_key,
          content: value,
          updated_at: new Date().toISOString(),
        }));
        const { error } = await supabase
          .from('cms_content')
          .upsert(rows, { onConflict: 'section_key' });
        if (error) throw error;
        setIsSaving(false);
        alert('Website content published.');
        return;
      } catch (e) {
        console.warn('[admin] CMS save failed, falling back to local:', e?.message || e);
      }
    }
    setTimeout(() => {
      setIsSaving(false);
      alert('Content published (local only — Supabase not reachable).');
    }, 350);
  };

  const updateSection = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateFAQ = (index, field, value) => {
    const newFaqs = [...content.faqs];
    newFaqs[index][field] = value;
    setContent(prev => ({ ...prev, faqs: newFaqs }));
  };

  const addFAQ = () => {
    setContent(prev => ({
      ...prev,
      faqs: [{ question: 'New Question', answer: 'New Answer' }, ...prev.faqs]
    }));
  };

  const removeFAQ = (index) => {
    const newFaqs = [...content.faqs];
    newFaqs.splice(index, 1);
    setContent(prev => ({ ...prev, faqs: newFaqs }));
  };

  const updateInventory = (index, field, value) => {
    const newInv = [...content.inventory];
    newInv[index][field] = value;
    setContent(prev => ({ ...prev, inventory: newInv }));
  };

  const addInventory = () => {
    setContent(prev => ({
      ...prev,
      inventory: [{ partName: 'New Part', stock: 0, reorderLevel: 5 }, ...prev.inventory]
    }));
  };

  const removeInventory = (index) => {
    const newInv = [...content.inventory];
    newInv.splice(index, 1);
    setContent(prev => ({ ...prev, inventory: newInv }));
  };

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Content Management</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Update your website content, FAQs, and promotions directly from here.</p>
          </div>
          <div className="flex gap-sm">
            <button 
              onClick={saveCMS}
              disabled={isSaving}
              className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-xs cursor-pointer shadow-sm disabled:opacity-70"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">publish</span>
              {isSaving ? 'Publishing...' : 'Publish Changes'}
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-outline-variant bg-surface-bright overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-sm px-lg py-sm font-label-md text-label-md transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'border-primary text-primary font-bold' 
                  : 'border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor Canvas */}
          <div className="p-lg md:p-xl bg-surface-container-lowest min-h-[500px]">
            {activeTab === 'homepage' && (
              <div className="flex flex-col gap-lg max-w-[800px]">
                <h2 className="font-title-lg text-title-lg text-on-surface border-b border-outline-variant pb-xs">Hero Section</h2>
                <div className="flex flex-col gap-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant">Main Headline</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                    value={content.homepage_hero.headline}
                    onChange={(e) => updateSection('homepage_hero', 'headline', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant">Subheading</label>
                  <textarea 
                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                    rows="2" 
                    value={content.homepage_hero.subheading}
                    onChange={(e) => updateSection('homepage_hero', 'subheading', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant">Call to Action Button</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none max-w-[300px]" 
                    value={content.homepage_hero.ctaText}
                    onChange={(e) => updateSection('homepage_hero', 'ctaText', e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'faq' && (
              <div className="flex flex-col gap-md">
                <button onClick={addFAQ} className="self-start px-md py-sm rounded border border-outline-variant text-primary font-label-md hover:bg-surface-container-low flex items-center gap-xs cursor-pointer shadow-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add</span> Add FAQ
                </button>
                <div className="border border-outline-variant rounded-lg overflow-hidden mt-sm max-w-[800px]">
                  {content.faqs.map((faq, index) => (
                    <div key={index} className={`p-md flex flex-col gap-sm relative group ${index !== 0 ? 'border-t border-outline-variant' : ''} ${index % 2 === 0 ? 'bg-surface-bright' : 'bg-surface'}`}>
                      <button onClick={() => removeFAQ(index)} className="absolute top-sm right-sm text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span aria-hidden="true" className="material-symbols-outlined">delete</span>
                      </button>
                      <input 
                        type="text" 
                        className="font-title-md font-bold text-on-surface bg-transparent border-none outline-none w-full pr-xl" 
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      />
                      <textarea 
                        className="text-body-md text-on-surface-variant bg-transparent border-none outline-none w-full resize-none" 
                        rows="2" 
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'promotions' && (
              <div className="flex flex-col gap-lg max-w-[800px]">
                <div className="flex items-center gap-md p-md bg-surface border border-outline-variant rounded-lg">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer"
                    checked={content.promotions.active}
                    onChange={(e) => updateSection('promotions', 'active', e.target.checked)}
                  />
                  <div className="flex flex-col">
                    <span className="font-title-md font-bold text-on-surface">Enable Promo Banner</span>
                    <span className="font-body-md text-on-surface-variant">Shows a banner at the top of your public website.</span>
                  </div>
                </div>
                {content.promotions.active && (
                  <>
                    <div className="flex flex-col gap-sm">
                      <label className="font-label-md text-label-md text-on-surface-variant">Banner Text</label>
                      <input 
                        type="text" 
                        className="w-full bg-surface border border-outline-variant rounded-lg p-sm text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                        value={content.promotions.bannerText}
                        onChange={(e) => updateSection('promotions', 'bannerText', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-sm">
                      <label className="font-label-md text-label-md text-on-surface-variant">Discount Code</label>
                      <input 
                        type="text" 
                        className="w-full bg-surface border border-outline-variant rounded-lg p-sm text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none max-w-[200px] font-code" 
                        value={content.promotions.discountCode}
                        onChange={(e) => updateSection('promotions', 'discountCode', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="flex flex-col gap-lg max-w-[800px]">
                <div className="flex flex-col gap-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs"><span aria-hidden="true" className="material-symbols-outlined text-[16px]">call</span> Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none max-w-[400px]" 
                    value={content.contact.phone}
                    onChange={(e) => updateSection('contact', 'phone', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs"><span aria-hidden="true" className="material-symbols-outlined text-[16px]">mail</span> Email Address</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none max-w-[400px]" 
                    value={content.contact.email}
                    onChange={(e) => updateSection('contact', 'email', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs"><span aria-hidden="true" className="material-symbols-outlined text-[16px]">location_on</span> Physical Address</label>
                  <textarea 
                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none max-w-[400px] resize-none" 
                    rows="3"
                    value={content.contact.address}
                    onChange={(e) => updateSection('contact', 'address', e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="flex flex-col gap-md">
                <div className="flex items-center justify-between mb-sm">
                  <h2 className="font-title-lg text-title-lg text-on-surface">Parts Inventory</h2>
                  <button onClick={addInventory} className="px-md py-sm rounded border border-outline-variant text-primary font-label-md hover:bg-surface-container-low flex items-center gap-xs cursor-pointer shadow-sm">
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add</span> Add Part
                  </button>
                </div>
                <div className="border border-outline-variant rounded-lg overflow-x-auto w-full">
                  <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                    <thead className="bg-surface-bright border-b border-outline-variant">
                      <tr>
                        <th className="p-sm font-label-md text-on-surface-variant">Part Name</th>
                        <th className="p-sm font-label-md text-on-surface-variant w-32">Stock Level</th>
                        <th className="p-sm font-label-md text-on-surface-variant w-32">Reorder Target</th>
                        <th className="p-sm font-label-md text-on-surface-variant w-16 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.inventory.map((item, index) => (
                        <tr key={index} className="border-b border-outline-variant last:border-0 hover:bg-surface transition-colors">
                          <td className="p-sm">
                            <input 
                              type="text" 
                              className="w-full bg-transparent border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded px-xs py-[2px] outline-none font-body-md text-on-surface" 
                              value={item.partName} 
                              onChange={(e) => updateInventory(index, 'partName', e.target.value)} 
                            />
                          </td>
                          <td className="p-sm">
                            <div className="flex items-center gap-xs">
                              <input 
                                type="number" 
                                className={`w-20 bg-transparent border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded px-xs py-[2px] outline-none font-body-md ${item.stock <= item.reorderLevel ? 'text-error font-bold bg-error-container/10' : 'text-on-surface'}`} 
                                value={item.stock} 
                                onChange={(e) => updateInventory(index, 'stock', parseInt(e.target.value) || 0)} 
                              />
                              {item.stock <= item.reorderLevel && (
                                <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-error" title="Low Stock Warning">warning</span>
                              )}
                            </div>
                          </td>
                          <td className="p-sm">
                            <input 
                              type="number" 
                              className="w-20 bg-transparent border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded px-xs py-[2px] outline-none font-body-md text-on-surface-variant" 
                              value={item.reorderLevel} 
                              onChange={(e) => updateInventory(index, 'reorderLevel', parseInt(e.target.value) || 0)} 
                            />
                          </td>
                          <td className="p-sm text-right">
                            <button onClick={() => removeInventory(index)} className="p-xs text-on-surface-variant hover:text-error transition-colors cursor-pointer rounded-full hover:bg-surface-container-low flex items-center justify-center">
                              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CMS;
