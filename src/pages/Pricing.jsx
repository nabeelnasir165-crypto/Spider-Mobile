import React, { useState, useMemo } from 'react';
import { devicePricing } from '../data/admin';

const Pricing = () => {
  const [activeBrand, setActiveBrand] = useState('Apple');
  const [pricingData, setPricingData] = useState(devicePricing);
  const loading = false;

  const brands = ['Apple', 'Samsung', 'Google', 'Huawei', 'Other'];

  const visibleRows = useMemo(
    () => pricingData.filter((p) => p.brand === activeBrand).sort((a, b) => a.model.localeCompare(b.model)),
    [pricingData, activeBrand]
  );

  const handleUpdate = (id, field, value) => {
    const numericValue = parseFloat(value) || 0;
    setPricingData((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: numericValue } : item)));
  };

  const addModelService = (model) => {
    const serviceName = prompt(`Enter new service name for ${model} (e.g. Screen Replacement):`);
    if (!serviceName) return;
    const created = {
      id: 'pr-' + Math.random().toString(36).slice(2, 8),
      brand: activeBrand,
      model,
      repair_type: serviceName,
      cost_price: 0,
      retail_price: 0,
    };
    setPricingData((prev) => [...prev, created]);
  };

  const addNewModel = () => {
    const model = prompt(`Enter new device model for ${activeBrand} (e.g. iPhone 14 Pro):`);
    if (!model) return;
    addModelService(model);
  };

  const deleteService = (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setPricingData((prev) => prev.filter((item) => item.id !== id));
  };

  const models = [...new Set(visibleRows.map((item) => item.model))];

  return (
    <main className="h-full overflow-y-auto p-md md:p-xl bg-background">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Pricing Manager</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Configure your repair prices by brand and model.</p>
          </div>
          <div className="flex gap-sm">
            <button onClick={addNewModel} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-xs cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Device Model
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-start">
          {/* Sidebar: Brands */}
          <div className="md:col-span-3 lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
            <h2 className="font-title-md font-semibold text-on-surface mb-sm px-sm">Brands</h2>
            <ul className="flex flex-col gap-xs">
              {brands.map(brand => (
                <li key={brand}>
                  <button 
                    onClick={() => setActiveBrand(brand)}
                    className={`w-full text-left px-sm py-2 rounded-lg font-label-md text-label-md transition-colors ${activeBrand === brand ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main List: Models and Repairs */}
          <div className="md:col-span-9 lg:col-span-10 flex flex-col gap-lg">
            {loading ? (
              <div className="flex justify-center items-center py-xl">
                <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: '32px' }}>autorenew</span>
              </div>
            ) : models.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl text-center shadow-sm">
                <p className="text-on-surface-variant mb-md">No pricing data found for {activeBrand}.</p>
                <button onClick={addNewModel} className="text-primary hover:underline font-label-md cursor-pointer">Add first model</button>
              </div>
            ) : (
              models.map((model) => (
                <div key={model} className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                  <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                    <h3 className="font-title-lg text-title-lg text-on-surface">{model}</h3>
                    <div className="flex gap-xs">
                      <button onClick={() => addModelService(model)} className="p-xs rounded text-primary hover:bg-primary-container/20 transition-colors cursor-pointer" title="Add Service">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">
                          <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium">Service Type</th>
                          <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium w-32">Cost Price (£)</th>
                          <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium w-32">Retail Price (£)</th>
                          <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-medium text-right w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
                        {visibleRows.filter(item => item.model === model).map((item) => (
                          <tr key={item.id}>
                            <td className="py-sm px-md font-medium text-on-surface">{item.repair_type}</td>
                            <td className="py-sm px-md">
                              <input 
                                type="number" 
                                className="w-full bg-transparent border-none outline-none text-on-surface-variant focus:text-primary transition-colors" 
                                value={item.cost_price}
                                onChange={(e) => handleUpdate(item.id, 'cost_price', e.target.value)}
                              />
                            </td>
                            <td className="py-sm px-md">
                              <input 
                                type="number" 
                                className="w-full bg-transparent border-none outline-none font-bold text-primary" 
                                value={item.retail_price}
                                onChange={(e) => handleUpdate(item.id, 'retail_price', e.target.value)}
                              />
                            </td>
                            <td className="py-sm px-md text-right">
                              <button onClick={() => deleteService(item.id)} className="text-on-surface-variant hover:text-error p-xs cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Pricing;
