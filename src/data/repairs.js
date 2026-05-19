export const brands = [
  { id: 'apple', name: 'Apple' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'google', name: 'Google' },
  { id: 'oneplus', name: 'OnePlus' },
  { id: 'huawei', name: 'Huawei' },
  { id: 'xiaomi', name: 'Xiaomi' },
];

export const models = {
  apple: [
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro / Pro Max' },
    { id: 'iphone-15', name: 'iPhone 15 / Plus' },
    { id: 'iphone-14', name: 'iPhone 14 series' },
    { id: 'iphone-13', name: 'iPhone 13 series' },
    { id: 'iphone-12', name: 'iPhone 12 series' },
    { id: 'iphone-11', name: 'iPhone 11 series' },
    { id: 'iphone-se', name: 'iPhone SE / 8' },
  ],
  samsung: [
    { id: 's24', name: 'Galaxy S24 series' },
    { id: 's23', name: 'Galaxy S23 series' },
    { id: 's22', name: 'Galaxy S22 series' },
    { id: 'note', name: 'Galaxy Note series' },
    { id: 'a', name: 'Galaxy A series' },
  ],
  google: [
    { id: 'pixel-8', name: 'Pixel 8 / Pro' },
    { id: 'pixel-7', name: 'Pixel 7 / Pro' },
    { id: 'pixel-6', name: 'Pixel 6 / Pro' },
  ],
  oneplus: [
    { id: 'op-12', name: 'OnePlus 12' },
    { id: 'op-11', name: 'OnePlus 11' },
    { id: 'op-nord', name: 'OnePlus Nord' },
  ],
  huawei: [
    { id: 'hw-p60', name: 'Huawei P60' },
    { id: 'hw-mate', name: 'Huawei Mate' },
  ],
  xiaomi: [
    { id: 'mi-14', name: 'Xiaomi 14 Pro' },
    { id: 'mi-redmi', name: 'Redmi Note' },
  ],
};

export const issues = [
  { id: 'screen', label: 'Screen replacement', icon: 'Smartphone', basePrice: 79 },
  { id: 'battery', label: 'Battery replacement', icon: 'BatteryCharging', basePrice: 39 },
  { id: 'charging', label: 'Charging port', icon: 'Plug', basePrice: 45 },
  { id: 'camera', label: 'Camera lens', icon: 'Camera', basePrice: 49 },
  { id: 'water', label: 'Water damage', icon: 'Droplets', basePrice: 65 },
  { id: 'speaker', label: 'Speaker / Mic', icon: 'Volume2', basePrice: 39 },
  { id: 'back-glass', label: 'Back glass', icon: 'Square', basePrice: 59 },
  { id: 'software', label: 'Software / diagnostics', icon: 'TerminalSquare', basePrice: 25 },
];

const tierMultiplier = {
  'iphone-15-pro': 1.6,
  'iphone-15': 1.45,
  'iphone-14': 1.35,
  'iphone-13': 1.2,
  'iphone-12': 1.1,
  'iphone-11': 1.0,
  'iphone-se': 0.85,
  s24: 1.55,
  s23: 1.4,
  s22: 1.25,
  note: 1.3,
  a: 0.9,
  'pixel-8': 1.4,
  'pixel-7': 1.2,
  'pixel-6': 1.05,
  'op-12': 1.3,
  'op-11': 1.2,
  'op-nord': 0.95,
  'hw-p60': 1.25,
  'hw-mate': 1.2,
  'mi-14': 1.2,
  'mi-redmi': 0.9,
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
  {
    icon: 'Smartphone',
    title: 'Screen Repair',
    desc: 'OEM-grade glass and OLED replacements with True-Tone calibration.',
    from: 79,
    badge: 'Most popular',
  },
  {
    icon: 'BatteryCharging',
    title: 'Battery Swap',
    desc: 'Genuine-spec batteries, full health restored — most done in 30 min.',
    from: 39,
  },
  {
    icon: 'Plug',
    title: 'Charging Port',
    desc: 'Fixes loose, slow or no-charge ports including USB-C and Lightning.',
    from: 45,
  },
  {
    icon: 'Camera',
    title: 'Camera & Lens',
    desc: 'Cracked lenses, blurry shots and focus issues — fully restored.',
    from: 49,
  },
  {
    icon: 'Droplets',
    title: 'Water Damage',
    desc: 'Multi-stage cleaning and component-level rescue. No-fix, no-fee.',
    from: 65,
  },
  {
    icon: 'Volume2',
    title: 'Speaker & Mic',
    desc: 'Restore clean audio for calls, music and FaceTime.',
    from: 39,
  },
  {
    icon: 'TerminalSquare',
    title: 'Software & Data',
    desc: 'Recovery, unlocks and full diagnostics by certified technicians.',
    from: 25,
  },
  {
    icon: 'Tablet',
    title: 'Tablets & Watches',
    desc: 'iPad, Galaxy Tab and Apple Watch repair specialists.',
    from: 59,
  },
];
