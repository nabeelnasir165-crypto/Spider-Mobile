export const brands = [
  { id: 'apple',   name: 'Apple' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'google',  name: 'Google' },
  { id: 'oneplus', name: 'OnePlus' },
  { id: 'huawei',  name: 'Huawei' },
  { id: 'xiaomi',  name: 'Xiaomi' },
];

// Comprehensive model list. Each entry is an individual model so the booking
// flow can produce an accurate quote and the admin pricing grid can target
// the exact device. Order is newest → oldest.
export const models = {
  apple: [
    { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max' },
    { id: 'iphone-16-pro',     name: 'iPhone 16 Pro' },
    { id: 'iphone-16-plus',    name: 'iPhone 16 Plus' },
    { id: 'iphone-16',         name: 'iPhone 16' },
    { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max' },
    { id: 'iphone-15-pro',     name: 'iPhone 15 Pro' },
    { id: 'iphone-15-plus',    name: 'iPhone 15 Plus' },
    { id: 'iphone-15',         name: 'iPhone 15' },
    { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max' },
    { id: 'iphone-14-pro',     name: 'iPhone 14 Pro' },
    { id: 'iphone-14-plus',    name: 'iPhone 14 Plus' },
    { id: 'iphone-14',         name: 'iPhone 14' },
    { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max' },
    { id: 'iphone-13-pro',     name: 'iPhone 13 Pro' },
    { id: 'iphone-13',         name: 'iPhone 13' },
    { id: 'iphone-13-mini',    name: 'iPhone 13 mini' },
    { id: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max' },
    { id: 'iphone-12-pro',     name: 'iPhone 12 Pro' },
    { id: 'iphone-12',         name: 'iPhone 12' },
    { id: 'iphone-12-mini',    name: 'iPhone 12 mini' },
    { id: 'iphone-11-pro-max', name: 'iPhone 11 Pro Max' },
    { id: 'iphone-11-pro',     name: 'iPhone 11 Pro' },
    { id: 'iphone-11',         name: 'iPhone 11' },
    { id: 'iphone-se-3',       name: 'iPhone SE (2022)' },
    { id: 'iphone-se-2',       name: 'iPhone SE (2020)' },
  ],
  samsung: [
    { id: 'galaxy-s24-ultra',  name: 'Galaxy S24 Ultra' },
    { id: 'galaxy-s24-plus',   name: 'Galaxy S24+' },
    { id: 'galaxy-s24',        name: 'Galaxy S24' },
    { id: 'galaxy-s23-ultra',  name: 'Galaxy S23 Ultra' },
    { id: 'galaxy-s23-plus',   name: 'Galaxy S23+' },
    { id: 'galaxy-s23',        name: 'Galaxy S23' },
    { id: 'galaxy-s22-ultra',  name: 'Galaxy S22 Ultra' },
    { id: 'galaxy-s22-plus',   name: 'Galaxy S22+' },
    { id: 'galaxy-s22',        name: 'Galaxy S22' },
    { id: 'galaxy-s21-ultra',  name: 'Galaxy S21 Ultra' },
    { id: 'galaxy-s21',        name: 'Galaxy S21' },
    { id: 'galaxy-note-20',    name: 'Galaxy Note 20 Ultra' },
    { id: 'galaxy-a54',        name: 'Galaxy A54 5G' },
    { id: 'galaxy-a34',        name: 'Galaxy A34 5G' },
  ],
  google: [
    { id: 'pixel-9-pro',       name: 'Pixel 9 Pro' },
    { id: 'pixel-9',           name: 'Pixel 9' },
    { id: 'pixel-8-pro',       name: 'Pixel 8 Pro' },
    { id: 'pixel-8',           name: 'Pixel 8' },
    { id: 'pixel-7-pro',       name: 'Pixel 7 Pro' },
    { id: 'pixel-7',           name: 'Pixel 7' },
    { id: 'pixel-6-pro',       name: 'Pixel 6 Pro' },
    { id: 'pixel-6',           name: 'Pixel 6' },
  ],
  oneplus: [
    { id: 'oneplus-12',        name: 'OnePlus 12' },
    { id: 'oneplus-11',        name: 'OnePlus 11' },
    { id: 'oneplus-10-pro',    name: 'OnePlus 10 Pro' },
    { id: 'oneplus-nord-3',    name: 'OnePlus Nord 3' },
  ],
  huawei: [
    { id: 'huawei-p60-pro',    name: 'Huawei P60 Pro' },
    { id: 'huawei-mate-50',    name: 'Huawei Mate 50' },
    { id: 'huawei-p50-pro',    name: 'Huawei P50 Pro' },
  ],
  xiaomi: [
    { id: 'xiaomi-14-pro',     name: 'Xiaomi 14 Pro' },
    { id: 'xiaomi-13t',        name: 'Xiaomi 13T Pro' },
    { id: 'redmi-note-13',     name: 'Redmi Note 13 Pro' },
  ],
};

export const issues = [
  { id: 'screen',     label: 'Screen replacement',       icon: 'Smartphone',      basePrice: 79 },
  { id: 'battery',    label: 'Battery replacement',      icon: 'BatteryCharging', basePrice: 39 },
  { id: 'charging',   label: 'Charging port',            icon: 'Plug',            basePrice: 45 },
  { id: 'camera',     label: 'Camera lens',              icon: 'Camera',          basePrice: 49 },
  { id: 'water',      label: 'Water damage',             icon: 'Droplets',        basePrice: 65 },
  { id: 'speaker',    label: 'Speaker / Mic',            icon: 'Volume2',         basePrice: 39 },
  { id: 'back-glass', label: 'Back glass',               icon: 'Square',          basePrice: 59 },
  { id: 'software',   label: 'Software / diagnostics',   icon: 'TerminalSquare',  basePrice: 25 },
];

// Per-model price tier. Pro Max / Ultra trim costs the most, older mid-range
// the least. Used by calcQuote() in /book and admin pricing seed defaults.
const tierMultiplier = {
  // Apple
  'iphone-16-pro-max': 1.75, 'iphone-16-pro': 1.65, 'iphone-16-plus': 1.55, 'iphone-16': 1.5,
  'iphone-15-pro-max': 1.65, 'iphone-15-pro': 1.55, 'iphone-15-plus': 1.45, 'iphone-15': 1.4,
  'iphone-14-pro-max': 1.5,  'iphone-14-pro': 1.4,  'iphone-14-plus': 1.35, 'iphone-14': 1.3,
  'iphone-13-pro-max': 1.35, 'iphone-13-pro': 1.3,  'iphone-13': 1.2,       'iphone-13-mini': 1.15,
  'iphone-12-pro-max': 1.25, 'iphone-12-pro': 1.2,  'iphone-12': 1.1,       'iphone-12-mini': 1.05,
  'iphone-11-pro-max': 1.1,  'iphone-11-pro': 1.05, 'iphone-11': 1.0,
  'iphone-se-3': 0.85, 'iphone-se-2': 0.8,
  // Samsung
  'galaxy-s24-ultra': 1.7,  'galaxy-s24-plus': 1.55, 'galaxy-s24': 1.45,
  'galaxy-s23-ultra': 1.55, 'galaxy-s23-plus': 1.4,  'galaxy-s23': 1.3,
  'galaxy-s22-ultra': 1.4,  'galaxy-s22-plus': 1.3,  'galaxy-s22': 1.2,
  'galaxy-s21-ultra': 1.25, 'galaxy-s21': 1.05,
  'galaxy-note-20': 1.3,
  'galaxy-a54': 0.9, 'galaxy-a34': 0.8,
  // Google
  'pixel-9-pro': 1.55, 'pixel-9': 1.45,
  'pixel-8-pro': 1.45, 'pixel-8': 1.35,
  'pixel-7-pro': 1.25, 'pixel-7': 1.15,
  'pixel-6-pro': 1.1,  'pixel-6': 1.0,
  // OnePlus
  'oneplus-12': 1.35, 'oneplus-11': 1.2, 'oneplus-10-pro': 1.1, 'oneplus-nord-3': 0.9,
  // Huawei
  'huawei-p60-pro': 1.3, 'huawei-mate-50': 1.25, 'huawei-p50-pro': 1.15,
  // Xiaomi
  'xiaomi-14-pro': 1.25, 'xiaomi-13t': 1.05, 'redmi-note-13': 0.85,
};

export const calcQuote = (modelId, issueId) => {
  const issue = issues.find((i) => i.id === issueId);
  if (!issue || !modelId) return null;
  const m = tierMultiplier[modelId] ?? 1;
  const price = Math.round(issue.basePrice * m);
  return {
    min: price,
    max: Math.round(price * 1.25),
    eta: issueId === 'water' ? '24–48 hr' : issueId === 'back-glass' ? '4 hr' : '30–60 min',
  };
};

export const services = [
  { icon: 'Smartphone',     title: 'Screen Repair',     desc: 'OEM-grade glass and OLED replacements with True-Tone calibration.', from: 79, badge: 'Most popular' },
  { icon: 'BatteryCharging',title: 'Battery Swap',      desc: 'Genuine-spec batteries, full health restored — most done in 30 min.', from: 39 },
  { icon: 'Plug',           title: 'Charging Port',     desc: 'Fixes loose, slow or no-charge ports including USB-C and Lightning.', from: 45 },
  { icon: 'Camera',         title: 'Camera & Lens',     desc: 'Cracked lenses, blurry shots and focus issues — fully restored.',     from: 49 },
  { icon: 'Droplets',       title: 'Water Damage',      desc: 'Multi-stage cleaning and component-level rescue. No-fix, no-fee.',    from: 65 },
  { icon: 'Volume2',        title: 'Speaker & Mic',     desc: 'Restore clean audio for calls, music and FaceTime.',                  from: 39 },
  { icon: 'TerminalSquare', title: 'Software & Data',   desc: 'Recovery, unlocks and full diagnostics by certified technicians.',    from: 25 },
  { icon: 'Tablet',         title: 'Tablets & Watches', desc: 'iPad, Galaxy Tab and Apple Watch repair specialists.',                from: 59 },
];
