// Curated phone photos bundled in public/products/ — local-first so the
// catalogue is bulletproof for client demos (no third-party CDN dependency).
const IMG = {
  appleProDark:    '/products/apple-pro.jpg',
  appleMidnight:   '/products/apple-dark.jpg',
  appleStarlight:  '/products/apple-light.jpg',
  appleBlue:       '/products/apple-color.jpg',
  galaxyUltra:     '/products/samsung.jpg',
  galaxyBlack:     '/products/samsung-alt.jpg',
  pixel:           '/products/google-pixel.jpg',
  oneplus:         '/products/oneplus.jpg',
  huawei:          '/products/huawei.jpg',
};

export const phones = [
  // ─── Apple ───────────────────────────────────────────────────────────────
  { id: 'iphone-16-pro-max-256', brand: 'Apple', name: 'iPhone 16 Pro Max 256GB', color: 'Desert Titanium',  storage: '256GB', display: '6.9" Super Retina XDR ProMotion', chip: 'A18 Pro', condition: 'Excellent', warranty: 12, price: 1099, rrp: 1399, image: IMG.appleProDark,   accent: '#cfa97f' },
  { id: 'iphone-16-pro-128',     brand: 'Apple', name: 'iPhone 16 Pro 128GB',     color: 'Natural Titanium', storage: '128GB', display: '6.3" Super Retina XDR ProMotion', chip: 'A18 Pro', condition: 'Excellent', warranty: 12, price:  949, rrp: 1199, image: IMG.appleProDark,   accent: '#dcd3c4' },
  { id: 'iphone-16-128',         brand: 'Apple', name: 'iPhone 16 128GB',         color: 'Ultramarine',      storage: '128GB', display: '6.1" Super Retina XDR',           chip: 'A18',     condition: 'Excellent', warranty: 12, price:  749, rrp:  899, image: IMG.appleBlue,      accent: '#5c6fc7' },
  { id: 'iphone-15-pro-max-256', brand: 'Apple', name: 'iPhone 15 Pro Max 256GB', color: 'Black Titanium',   storage: '256GB', display: '6.7" Super Retina XDR ProMotion', chip: 'A17 Pro', condition: 'Excellent', warranty: 12, price:  949, rrp: 1199, image: IMG.appleProDark,   accent: '#2a2a2a' },
  { id: 'iphone-15-pro-128',     brand: 'Apple', name: 'iPhone 15 Pro 128GB',     color: 'Natural Titanium', storage: '128GB', display: '6.1" Super Retina XDR ProMotion', chip: 'A17 Pro', condition: 'Excellent', warranty: 12, price:  849, rrp: 1099, image: IMG.appleProDark,   accent: '#dcd3c4' },
  { id: 'iphone-15-128',         brand: 'Apple', name: 'iPhone 15 128GB',         color: 'Pink',             storage: '128GB', display: '6.1" Super Retina XDR',           chip: 'A16',     condition: 'Excellent', warranty: 12, price:  619, rrp:  799, image: IMG.appleStarlight, accent: '#f6d6d8' },
  { id: 'iphone-14-pro-256',     brand: 'Apple', name: 'iPhone 14 Pro 256GB',     color: 'Deep Purple',      storage: '256GB', display: '6.1" Super Retina XDR ProMotion', chip: 'A16',     condition: 'Very Good', warranty: 12, price:  699, rrp:  999, image: IMG.appleProDark,   accent: '#605468' },
  { id: 'iphone-14-128',         brand: 'Apple', name: 'iPhone 14 128GB',         color: 'Midnight',         storage: '128GB', display: '6.1" Super Retina XDR',           chip: 'A15',     condition: 'Very Good', warranty: 12, price:  549, rrp:  799, image: IMG.appleMidnight,  accent: '#1c1d22' },
  { id: 'iphone-13-128',         brand: 'Apple', name: 'iPhone 13 128GB',         color: 'Starlight',        storage: '128GB', display: '6.1" Super Retina XDR',           chip: 'A15',     condition: 'Good',      warranty: 12, price:  419, rrp:  699, image: IMG.appleStarlight, accent: '#f2ebe0' },
  { id: 'iphone-12-64',          brand: 'Apple', name: 'iPhone 12 64GB',          color: 'Blue',             storage:  '64GB', display: '6.1" Super Retina XDR',           chip: 'A14',     condition: 'Good',      warranty: 12, price:  329, rrp:  599, image: IMG.appleBlue,      accent: '#1f3147' },
  { id: 'iphone-11-64',          brand: 'Apple', name: 'iPhone 11 64GB',          color: 'Black',            storage:  '64GB', display: '6.1" Liquid Retina HD',           chip: 'A13',     condition: 'Good',      warranty: 12, price:  229, rrp:  449, image: IMG.appleMidnight,  accent: '#1a1a1a' },
  { id: 'iphone-se-3-64',        brand: 'Apple', name: 'iPhone SE (2022) 64GB',   color: 'Starlight',        storage:  '64GB', display: '4.7" Retina HD',                  chip: 'A15',     condition: 'Very Good', warranty: 12, price:  259, rrp:  419, image: IMG.appleStarlight, accent: '#efe9dc' },

  // ─── Samsung ─────────────────────────────────────────────────────────────
  { id: 'galaxy-s24-ultra-256', brand: 'Samsung', name: 'Galaxy S24 Ultra 256GB', color: 'Titanium Black', storage: '256GB', display: '6.8" Dynamic AMOLED 2X 120Hz', chip: 'Snapdragon 8 Gen 3',   condition: 'Excellent', warranty: 12, price: 899, rrp: 1249, image: IMG.galaxyUltra, accent: '#22272f' },
  { id: 'galaxy-s24-128',       brand: 'Samsung', name: 'Galaxy S24 128GB',       color: 'Onyx Black',     storage: '128GB', display: '6.2" Dynamic AMOLED 2X 120Hz', chip: 'Exynos 2400',          condition: 'Excellent', warranty: 12, price: 649, rrp:  799, image: IMG.galaxyBlack, accent: '#1a1a1a' },
  { id: 'galaxy-s23-128',       brand: 'Samsung', name: 'Galaxy S23 128GB',       color: 'Phantom Black',  storage: '128GB', display: '6.1" Dynamic AMOLED 2X 120Hz', chip: 'Snapdragon 8 Gen 2',   condition: 'Very Good', warranty: 12, price: 459, rrp:  849, image: IMG.galaxyBlack, accent: '#1c1d22' },
  { id: 'galaxy-s22-128',       brand: 'Samsung', name: 'Galaxy S22 128GB',       color: 'Graphite',       storage: '128GB', display: '6.1" Dynamic AMOLED 2X 120Hz', chip: 'Snapdragon 8 Gen 1',   condition: 'Good',      warranty: 12, price: 349, rrp:  769, image: IMG.galaxyBlack, accent: '#3c3f44' },
  { id: 'galaxy-s21-128',       brand: 'Samsung', name: 'Galaxy S21 128GB',       color: 'Phantom Grey',   storage: '128GB', display: '6.2" Dynamic AMOLED 2X 120Hz', chip: 'Exynos 2100',          condition: 'Good',      warranty: 12, price: 259, rrp:  769, image: IMG.galaxyBlack, accent: '#4a4f57' },
  { id: 'galaxy-a54-128',       brand: 'Samsung', name: 'Galaxy A54 5G 128GB',    color: 'Awesome Lime',   storage: '128GB', display: '6.4" Super AMOLED 120Hz',      chip: 'Exynos 1380',          condition: 'Excellent', warranty: 12, price: 269, rrp:  449, image: IMG.galaxyBlack, accent: '#9bb38b' },

  // ─── Google ──────────────────────────────────────────────────────────────
  { id: 'pixel-9-pro-128',  brand: 'Google', name: 'Google Pixel 9 Pro 128GB',  color: 'Obsidian', storage: '128GB', display: '6.3" LTPO OLED 120Hz',          chip: 'Tensor G4', condition: 'Excellent', warranty: 12, price: 739, rrp: 999, image: IMG.pixel, accent: '#23272d' },
  { id: 'pixel-8-pro-128',  brand: 'Google', name: 'Google Pixel 8 Pro 128GB',  color: 'Bay',      storage: '128GB', display: '6.7" LTPO OLED 120Hz',          chip: 'Tensor G3', condition: 'Excellent', warranty: 12, price: 599, rrp: 899, image: IMG.pixel, accent: '#a8c0d4' },
  { id: 'pixel-8-128',      brand: 'Google', name: 'Google Pixel 8 128GB',      color: 'Obsidian', storage: '128GB', display: '6.2" OLED 120Hz',               chip: 'Tensor G3', condition: 'Excellent', warranty: 12, price: 489, rrp: 699, image: IMG.pixel, accent: '#23272d' },
  { id: 'pixel-7-128',      brand: 'Google', name: 'Google Pixel 7 128GB',      color: 'Snow',     storage: '128GB', display: '6.3" OLED 90Hz',                chip: 'Tensor G2', condition: 'Very Good', warranty: 12, price: 329, rrp: 599, image: IMG.pixel, accent: '#e7e8eb' },

  // ─── OnePlus ─────────────────────────────────────────────────────────────
  { id: 'oneplus-12-256', brand: 'OnePlus', name: 'OnePlus 12 256GB', color: 'Silky Black',   storage: '256GB', display: '6.82" LTPO AMOLED 120Hz', chip: 'Snapdragon 8 Gen 3', condition: 'Excellent', warranty: 12, price: 649, rrp: 849, image: IMG.oneplus, accent: '#1c1d22' },
  { id: 'oneplus-11-256', brand: 'OnePlus', name: 'OnePlus 11 256GB', color: 'Eternal Green', storage: '256GB', display: '6.7" LTPO AMOLED 120Hz',  chip: 'Snapdragon 8 Gen 2', condition: 'Very Good', warranty: 12, price: 389, rrp: 729, image: IMG.oneplus, accent: '#1c2c25' },

  // ─── Huawei ──────────────────────────────────────────────────────────────
  { id: 'huawei-p60-pro-256', brand: 'Huawei', name: 'Huawei P60 Pro 256GB', color: 'Rococo Pearl', storage: '256GB', display: '6.67" LTPO OLED 120Hz', chip: 'Snapdragon 8+ Gen 1', condition: 'Good', warranty: 12, price: 439, rrp: 799, image: IMG.huawei, accent: '#dfd6c8' },
];

export const conditions = ['Excellent', 'Very Good', 'Good'];

// ─── Accessory images (bundled in public/accessories/) ───────────────────
const A = {
  case:     '/accessories/case.jpg',
  charger:  '/accessories/charger.jpg',
  screen:   '/accessories/screen-protector.jpg',
  power:    '/accessories/power-bank.jpg',
  audio:    '/accessories/audio.jpg',
  cable:    '/accessories/cable.jpg',
  magsafe:  '/accessories/wireless-pad.jpg',
  headset:  '/accessories/headphones.jpg',
  lightning:'/accessories/lightning.jpg',
};

export const accessoryCategories = [
  { id: 'cases',             name: 'Cases & Covers',     desc: 'Premium impact protection without the bulk.',   image: A.case,    accent: 'from-sky-500/30 to-sky-700/10' },
  { id: 'chargers',          name: 'Chargers',           desc: 'Fast, certified USB-C and MagSafe-compatible.', image: A.charger, accent: 'from-emerald-500/30 to-emerald-700/10' },
  { id: 'screen-protectors', name: 'Screen Protectors',  desc: 'Tempered glass and privacy films, fitted free.',image: A.screen,  accent: 'from-amber-500/30 to-amber-700/10' },
  { id: 'power-banks',       name: 'Power Banks',        desc: 'Pocket-sized 10–20K mAh with PD output.',       image: A.power,   accent: 'from-violet-500/30 to-violet-700/10' },
  { id: 'audio',             name: 'Audio Devices',      desc: 'Earbuds, headphones and portable speakers.',    image: A.audio,   accent: 'from-rose-500/30 to-rose-700/10' },
  { id: 'cables',            name: 'Cables & Adapters',  desc: 'Braided, MFi-certified, lifetime tested.',      image: A.cable,   accent: 'from-cyan-500/30 to-cyan-700/10' },
];

export const accessories = [
  // ─── Cases ─────────────────────────────────────────────────────────────
  { id: 'a1',  category: 'cases',             name: 'MagSafe Clear Case',         forModel: 'iPhone 15 Pro',                  price: 19.99, image: A.case },
  { id: 'a2',  category: 'cases',             name: 'Premium Leather Folio',      forModel: 'iPhone 14 / 15',                 price: 34.99, image: A.case },
  { id: 'a13', category: 'cases',             name: 'Silicone Bumper Case',       forModel: 'iPhone 16 Pro',                  price: 24.99, image: A.case },
  { id: 'a14', category: 'cases',             name: 'Rugged Armor Case',          forModel: 'Galaxy S24 Ultra',               price: 27.99, image: A.case },

  // ─── Chargers ──────────────────────────────────────────────────────────
  { id: 'a3',  category: 'chargers',          name: '30W USB-C Adapter',          forModel: 'Universal',                      price: 24.99, image: A.charger },
  { id: 'a4',  category: 'chargers',          name: 'MagSafe Wireless Pad 15W',   forModel: 'iPhone 12 / 13 / 14 / 15 / 16',  price: 29.99, image: A.magsafe },
  { id: 'a15', category: 'chargers',          name: 'Dual USB-C 65W Adapter',     forModel: 'Universal',                      price: 39.99, image: A.charger },

  // ─── Screen Protectors ─────────────────────────────────────────────────
  { id: 'a5',  category: 'screen-protectors', name: 'Tempered Glass 9H',          forModel: 'iPhone 15 series',               price: 12.99, image: A.screen },
  { id: 'a6',  category: 'screen-protectors', name: 'Privacy Tempered Glass',     forModel: 'Galaxy S24',                     price: 14.99, image: A.screen },
  { id: 'a16', category: 'screen-protectors', name: 'Anti-Glare Matte Film',      forModel: 'Pixel 8 / 9',                    price:  9.99, image: A.screen },

  // ─── Power Banks ───────────────────────────────────────────────────────
  { id: 'a7',  category: 'power-banks',       name: '20K mAh PD Power Bank',      forModel: 'Universal',                      price: 39.99, image: A.power },
  { id: 'a8',  category: 'power-banks',       name: '10K mAh Magnetic Pack',      forModel: 'iPhone 12 / 13 / 14 / 15 / 16',  price: 29.99, image: A.power },

  // ─── Audio ─────────────────────────────────────────────────────────────
  { id: 'a9',  category: 'audio',             name: 'Wireless Earbuds Pro',       forModel: 'Universal',                      price: 49.99, image: A.audio },
  { id: 'a10', category: 'audio',             name: 'Over-Ear Headphones',        forModel: 'Universal',                      price: 79.99, image: A.headset },

  // ─── Cables ────────────────────────────────────────────────────────────
  { id: 'a11', category: 'cables',            name: 'Braided USB-C → USB-C 2m',   forModel: 'Universal',                      price:  9.99, image: A.cable },
  { id: 'a12', category: 'cables',            name: 'Lightning MFi 1m',           forModel: 'iPhone (pre-USB-C)',             price: 14.99, image: A.lightning },
];

export const reviews = [
  { name: 'Olivia P.',  handle: '@olivia',   rating: 5, text: 'Cracked my iPhone 14 screen on a Friday — picked it up after work, fixed in 40 minutes. Looks brand new. Could not recommend more highly.' },
  { name: 'Daniel R.',  handle: '@dan_r',    rating: 5, text: 'My Pixel 7 battery was shot. Replaced in under an hour and they explained the process clearly. Honest pricing, no surprises.' },
  { name: 'Hannah M.',  handle: '@hannah_m', rating: 5, text: 'Bought a refurbished S22 — looks unused and came with a 12-month warranty. Saved hundreds vs new.' },
  { name: 'Jake T.',    handle: '@jaketea',  rating: 5, text: 'Water-damaged my iPhone and thought it was gone. The team rescued it. Genuinely surprised by their skills.' },
  { name: 'Sophia L.',  handle: '@sophiaL',  rating: 5, text: 'Sticky charging port — they cleaned and replaced it on the spot. Friendly, fast, fairly priced.' },
  { name: 'Mark D.',    handle: '@markdv',   rating: 5, text: 'My business depends on my phone — they understood the urgency and turned it around in 25 mins.' },
];
