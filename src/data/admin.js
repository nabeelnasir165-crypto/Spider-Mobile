// Local mock data for the admin dashboard.
// Replaces the Supabase queries so the dashboard works without any backend.

export const customers = [
  { id: 'c1', full_name: 'Sarah Jenkins',  email: 'sarah.j@example.com', phone: '+44 7700 900077', address: '12 High St, London', is_business_account: false, notes: 'Returning customer — prefers SMS updates.', created_at: '2026-05-14T10:00:00Z' },
  { id: 'c2', full_name: 'David Chen',     email: 'david.c@example.com', phone: '+44 7700 900088', address: '45 Baker St, London', is_business_account: true,  notes: 'Corporate account — bulk billing.',     created_at: '2026-05-12T09:00:00Z' },
  { id: 'c3', full_name: 'Emma Watson',    email: 'emma.w@example.com',  phone: '+44 7700 900099', address: '88 Oxford St, London', is_business_account: false, notes: '',                                      created_at: '2026-05-10T15:00:00Z' },
  { id: 'c4', full_name: 'Marcus Brown',   email: 'marcus.b@example.com',phone: '+44 7700 900111', address: '5 Park Lane, Derby',   is_business_account: false, notes: '',                                      created_at: '2026-05-15T11:00:00Z' },
  { id: 'c5', full_name: 'Olivia Pearson', email: 'olivia.p@example.com',phone: '+44 7700 900222', address: '7 Friar Gate, Derby',  is_business_account: false, notes: '',                                      created_at: '2026-05-16T13:00:00Z' },
  { id: 'c6', full_name: 'Hannah Marsh',   email: 'hannah.m@example.com',phone: '+44 7700 900333', address: '1 Iron Gate, Derby',   is_business_account: false, notes: '',                                      created_at: '2026-05-17T16:00:00Z' },
];

const findCustomer = (id) => customers.find((c) => c.id === id);

export const tickets = [
  { id: 't1', ticket_ref: 'REP-1042', customer_id: 'c1', device_brand: 'Apple',   device_model: 'iPhone 13 Pro',  device_imei: '354892019384721', device_passcode: '****', reported_issues: ['Screen Damage'],    condition_checklist: { scratches: 'minor', power: 'on', charging: 'ok' }, accessories_received: ['SIM'],           status: 'Repairing', payment_status: 'Paid',   estimated_price: 185, assigned_tech: 'Mike T.',   delivery_info: { method: 'collection', tracking: '' }, created_at: '2026-05-19T08:30:00Z', updated_at: '2026-05-19T08:30:00Z' },
  { id: 't2', ticket_ref: 'REP-1041', customer_id: 'c2', device_brand: 'Apple',   device_model: 'MacBook Air M1', device_imei: 'C02XD4A5JGH6',    device_passcode: '****', reported_issues: ['Battery Drain'],    condition_checklist: { scratches: 'none',  power: 'on', charging: 'slow' }, accessories_received: ['Charger'],     status: 'Completed', payment_status: 'Unpaid', estimated_price: 85,  assigned_tech: 'Priya S.',  delivery_info: { method: 'collection', tracking: '' }, created_at: '2026-05-19T09:00:00Z', updated_at: '2026-05-19T15:00:00Z' },
  { id: 't3', ticket_ref: 'REP-1040', customer_id: 'c3', device_brand: 'Samsung', device_model: 'Galaxy S21',      device_imei: '359992019384721', device_passcode: '****', reported_issues: ['Charging Port'],    condition_checklist: { scratches: 'minor', power: 'on', charging: 'no' },  accessories_received: ['Case', 'SIM'], status: 'Completed', payment_status: 'Paid',   estimated_price: 65,  assigned_tech: 'James H.',  delivery_info: { method: 'courier',    tracking: 'DPD-XX12345' }, created_at: '2026-05-19T10:30:00Z', updated_at: '2026-05-19T14:00:00Z' },
  { id: 't4', ticket_ref: 'REP-1039', customer_id: 'c4', device_brand: 'Google',  device_model: 'Pixel 8',          device_imei: '352099001761481', device_passcode: '****', reported_issues: ['Camera Lens'],      condition_checklist: { scratches: 'none',  power: 'on', charging: 'ok' },  accessories_received: [],              status: 'Diagnosed', payment_status: 'Unpaid', estimated_price: 75,  assigned_tech: 'Mike T.',   delivery_info: { method: 'collection', tracking: '' }, created_at: '2026-05-18T11:00:00Z', updated_at: '2026-05-18T13:00:00Z' },
  { id: 't5', ticket_ref: 'REP-1038', customer_id: 'c5', device_brand: 'Apple',   device_model: 'iPhone 14',        device_imei: '353919019173821', device_passcode: '****', reported_issues: ['Water Damage'],     condition_checklist: { scratches: 'major', power: 'off',charging: 'no' },  accessories_received: ['SIM'],         status: 'Ready',     payment_status: 'Paid',   estimated_price: 120, assigned_tech: 'Priya S.',  delivery_info: { method: 'collection', tracking: '' }, created_at: '2026-05-18T14:00:00Z', updated_at: '2026-05-19T11:00:00Z' },
  { id: 't6', ticket_ref: 'REP-1037', customer_id: 'c1', device_brand: 'Apple',   device_model: 'iPhone 12 Pro Max',device_imei: '352099001999333', device_passcode: '****', reported_issues: ['Back Glass'],       condition_checklist: { scratches: 'minor', power: 'on', charging: 'ok' },  accessories_received: ['Case'],        status: 'Completed', payment_status: 'Paid',   estimated_price: 99,  assigned_tech: 'James H.',  delivery_info: { method: 'collection', tracking: '' }, created_at: '2026-05-17T15:00:00Z', updated_at: '2026-05-17T18:00:00Z' },
  { id: 't7', ticket_ref: 'REP-1036', customer_id: 'c6', device_brand: 'OnePlus', device_model: '11',               device_imei: '861500050501234', device_passcode: '****', reported_issues: ['Speaker / Mic'],    condition_checklist: { scratches: 'none',  power: 'on', charging: 'ok' },  accessories_received: [],              status: 'Booked',    payment_status: 'Unpaid', estimated_price: 40,  assigned_tech: '',          delivery_info: { method: 'collection', tracking: '' }, created_at: '2026-05-17T17:00:00Z', updated_at: '2026-05-17T17:00:00Z' },
  { id: 't8', ticket_ref: 'REP-1035', customer_id: 'c2', device_brand: 'Apple',   device_model: 'iPad Air',         device_imei: 'DMPGV2X8GHV5',    device_passcode: '****', reported_issues: ['Screen Damage'],    condition_checklist: { scratches: 'major', power: 'on', charging: 'ok' },  accessories_received: ['Charger'],     status: 'Repairing', payment_status: 'Paid',   estimated_price: 145, assigned_tech: 'Mike T.',   delivery_info: { method: 'collection', tracking: '' }, created_at: '2026-05-16T10:00:00Z', updated_at: '2026-05-19T09:00:00Z' },
];

// Attach customer object to ticket (matches the Supabase join shape used by the dashboard)
export const ticketsWithCustomer = tickets.map((t) => ({
  ...t,
  customers: findCustomer(t.customer_id) || null,
}));

export const ticketNotes = [
  { id: 'n1', ticket_id: 't1', author: 'Mike T. (Tech)',   content: 'Diagnostic complete — screen confirmed cracked. Awaiting customer approval for OEM screen.', is_status_update: true,  created_at: '2026-05-19T08:45:00Z' },
  { id: 'n2', ticket_id: 't1', author: 'Customer Care',     content: 'Customer approved repair. Status moved to Repairing.',                                       is_status_update: true,  created_at: '2026-05-19T09:15:00Z' },
  { id: 'n3', ticket_id: 't1', author: 'Mike T. (Tech)',    content: 'Screen replaced. Running 15-point QC.',                                                       is_status_update: false, created_at: '2026-05-19T11:30:00Z' },
  { id: 'n4', ticket_id: 't2', author: 'Priya S. (Tech)',   content: 'Battery replaced with OEM unit. Tested OK. Awaiting payment.',                                is_status_update: true,  created_at: '2026-05-19T15:00:00Z' },
  { id: 'n5', ticket_id: 't3', author: 'James H. (Tech)',   content: 'Charging port assembly replaced. Tested with multiple cables — works perfectly.',             is_status_update: true,  created_at: '2026-05-19T14:00:00Z' },
];

export const bookings = [
  { id: 'b1', booking_ref: 'SM-2451', customer_name: 'Olivia Pearson', customer_email: 'olivia.p@example.com', customer_phone: '+44 7700 900222', service_requested: 'Screen Repair', requested_date: '2026-05-20T16:30:00Z', status: 'Pending',   created_at: '2026-05-19T13:10:00Z' },
  { id: 'b2', booking_ref: 'SM-2469', customer_name: 'Daniel Reed',    customer_email: 'd.reed@example.com',   customer_phone: '+44 7700 900444', service_requested: 'Battery Swap',  requested_date: '2026-05-21T11:00:00Z', status: 'Confirmed', created_at: '2026-05-19T09:45:00Z' },
  { id: 'b3', booking_ref: 'SM-2484', customer_name: 'Hannah Marsh',   customer_email: 'hannah.m@example.com', customer_phone: '+44 7700 900333', service_requested: 'Charging Port', requested_date: '2026-05-22T10:00:00Z', status: 'Pending',   created_at: '2026-05-19T15:20:00Z' },
  { id: 'b4', booking_ref: 'SM-2491', customer_name: 'Mark Davies',    customer_email: 'mark.d@example.com',   customer_phone: '+44 7700 900555', service_requested: 'Diagnostics',   requested_date: '2026-05-20T09:00:00Z', status: 'Converted', created_at: '2026-05-18T12:00:00Z' },
];

// ─── Device repair pricing grid (used by /admin/pricing) ───────────────────
// Covers the top ~30 models in active service. Each model carries Screen /
// Battery / Charging Port at minimum; Pro/Ultra trims also carry Back Glass.
// Cost price ≈ part + labour; retail price = customer-facing quote.
const buildPricing = () => {
  // [brand, model, screen{cost,retail}, battery{cost,retail}, port{cost,retail}, backGlass?{cost,retail}]
  const tiers = [
    // ─── Apple ────────────────────────────────────────────────────────────
    ['Apple', 'iPhone 16 Pro Max',  { c: 140, r: 249 }, { c: 45, r:  89 }, { c: 35, r:  79 }, { c: 60, r: 129 }],
    ['Apple', 'iPhone 16 Pro',      { c: 130, r: 229 }, { c: 40, r:  85 }, { c: 32, r:  75 }, { c: 55, r: 119 }],
    ['Apple', 'iPhone 16 Plus',     { c: 115, r: 209 }, { c: 38, r:  79 }, { c: 30, r:  69 }, null],
    ['Apple', 'iPhone 16',          { c: 110, r: 199 }, { c: 35, r:  75 }, { c: 28, r:  65 }, null],
    ['Apple', 'iPhone 15 Pro Max',  { c: 130, r: 229 }, { c: 40, r:  85 }, { c: 32, r:  75 }, { c: 55, r: 119 }],
    ['Apple', 'iPhone 15 Pro',      { c: 115, r: 209 }, { c: 38, r:  79 }, { c: 30, r:  69 }, { c: 50, r: 109 }],
    ['Apple', 'iPhone 15 Plus',     { c: 100, r: 189 }, { c: 35, r:  75 }, { c: 28, r:  65 }, null],
    ['Apple', 'iPhone 15',          { c:  95, r: 179 }, { c: 32, r:  69 }, { c: 26, r:  59 }, null],
    ['Apple', 'iPhone 14 Pro Max',  { c: 100, r: 189 }, { c: 35, r:  75 }, { c: 28, r:  65 }, { c: 45, r:  99 }],
    ['Apple', 'iPhone 14 Pro',      { c:  90, r: 169 }, { c: 30, r:  69 }, { c: 26, r:  59 }, { c: 42, r:  95 }],
    ['Apple', 'iPhone 14 Plus',     { c:  85, r: 159 }, { c: 28, r:  65 }, { c: 24, r:  55 }, null],
    ['Apple', 'iPhone 14',          { c:  80, r: 149 }, { c: 25, r:  59 }, { c: 22, r:  55 }, null],
    ['Apple', 'iPhone 13 Pro Max',  { c:  80, r: 149 }, { c: 26, r:  59 }, { c: 22, r:  55 }, { c: 40, r:  89 }],
    ['Apple', 'iPhone 13 Pro',      { c:  75, r: 139 }, { c: 24, r:  55 }, { c: 22, r:  55 }, { c: 38, r:  85 }],
    ['Apple', 'iPhone 13',          { c:  60, r: 119 }, { c: 22, r:  55 }, { c: 20, r:  49 }, null],
    ['Apple', 'iPhone 13 mini',     { c:  60, r: 115 }, { c: 22, r:  55 }, { c: 20, r:  49 }, null],
    ['Apple', 'iPhone 12 Pro Max',  { c:  70, r: 129 }, { c: 24, r:  55 }, { c: 22, r:  55 }, { c: 36, r:  79 }],
    ['Apple', 'iPhone 12',          { c:  55, r: 109 }, { c: 22, r:  49 }, { c: 20, r:  45 }, null],
    ['Apple', 'iPhone 11 Pro Max',  { c:  60, r: 115 }, { c: 22, r:  55 }, { c: 20, r:  49 }, null],
    ['Apple', 'iPhone 11',          { c:  45, r:  99 }, { c: 20, r:  45 }, { c: 18, r:  45 }, null],
    ['Apple', 'iPhone SE (2022)',   { c:  35, r:  69 }, { c: 18, r:  39 }, { c: 16, r:  39 }, null],
    // ─── Samsung ──────────────────────────────────────────────────────────
    ['Samsung', 'Galaxy S24 Ultra', { c: 130, r: 229 }, { c: 38, r:  79 }, { c: 28, r:  65 }, { c: 55, r: 119 }],
    ['Samsung', 'Galaxy S24+',      { c: 100, r: 189 }, { c: 32, r:  69 }, { c: 25, r:  59 }, null],
    ['Samsung', 'Galaxy S24',       { c:  90, r: 169 }, { c: 30, r:  65 }, { c: 24, r:  55 }, null],
    ['Samsung', 'Galaxy S23 Ultra', { c: 110, r: 199 }, { c: 34, r:  75 }, { c: 26, r:  59 }, { c: 50, r: 109 }],
    ['Samsung', 'Galaxy S23+',      { c:  90, r: 169 }, { c: 30, r:  65 }, { c: 24, r:  55 }, null],
    ['Samsung', 'Galaxy S23',       { c:  80, r: 149 }, { c: 28, r:  59 }, { c: 22, r:  55 }, null],
    ['Samsung', 'Galaxy S22',       { c:  70, r: 139 }, { c: 25, r:  55 }, { c: 20, r:  49 }, null],
    ['Samsung', 'Galaxy S21',       { c:  60, r: 119 }, { c: 22, r:  49 }, { c: 18, r:  45 }, null],
    ['Samsung', 'Galaxy Note 20 Ultra', { c: 85, r: 159 }, { c: 30, r:  65 }, { c: 24, r:  55 }, null],
    ['Samsung', 'Galaxy A54 5G',    { c:  50, r:  99 }, { c: 20, r:  45 }, { c: 18, r:  39 }, null],
    // ─── Google ───────────────────────────────────────────────────────────
    ['Google', 'Pixel 9 Pro',       { c:  90, r: 169 }, { c: 30, r:  65 }, { c: 24, r:  55 }, null],
    ['Google', 'Pixel 9',           { c:  80, r: 149 }, { c: 28, r:  59 }, { c: 22, r:  55 }, null],
    ['Google', 'Pixel 8 Pro',       { c:  80, r: 149 }, { c: 28, r:  59 }, { c: 22, r:  55 }, null],
    ['Google', 'Pixel 8',           { c:  65, r: 129 }, { c: 25, r:  55 }, { c: 20, r:  49 }, null],
    ['Google', 'Pixel 7',           { c:  55, r: 109 }, { c: 22, r:  49 }, { c: 18, r:  45 }, null],
    ['Google', 'Pixel 6',           { c:  45, r:  99 }, { c: 20, r:  45 }, { c: 18, r:  45 }, null],
    // ─── OnePlus ──────────────────────────────────────────────────────────
    ['Other', 'OnePlus 12',         { c:  70, r: 139 }, { c: 25, r:  55 }, { c: 20, r:  49 }, null],
    ['Other', 'OnePlus 11',         { c:  60, r: 119 }, { c: 22, r:  49 }, { c: 18, r:  45 }, null],
    // ─── Huawei ───────────────────────────────────────────────────────────
    ['Huawei', 'P60 Pro',           { c:  70, r: 139 }, { c: 25, r:  55 }, { c: 20, r:  49 }, null],
    ['Huawei', 'Mate 50',           { c:  60, r: 119 }, { c: 22, r:  49 }, { c: 18, r:  45 }, null],
    // ─── Xiaomi ───────────────────────────────────────────────────────────
    ['Other', 'Xiaomi 14 Pro',      { c:  65, r: 129 }, { c: 22, r:  49 }, { c: 18, r:  45 }, null],
    ['Other', 'Redmi Note 13 Pro',  { c:  40, r:  79 }, { c: 18, r:  39 }, { c: 16, r:  39 }, null],
  ];

  const rows = [];
  let i = 1;
  const pad = (n) => String(n).padStart(3, '0');
  for (const [brand, model, screen, battery, port, backGlass] of tiers) {
    rows.push({ id: `pr-${pad(i++)}`, brand, model, repair_type: 'Screen Replacement',  cost_price: screen.c,  retail_price: screen.r  });
    rows.push({ id: `pr-${pad(i++)}`, brand, model, repair_type: 'Battery Replacement', cost_price: battery.c, retail_price: battery.r });
    rows.push({ id: `pr-${pad(i++)}`, brand, model, repair_type: 'Charging Port',       cost_price: port.c,    retail_price: port.r    });
    if (backGlass) {
      rows.push({ id: `pr-${pad(i++)}`, brand, model, repair_type: 'Back Glass',        cost_price: backGlass.c, retail_price: backGlass.r });
    }
  }
  return rows;
};

export const devicePricing = buildPricing();

// Backwards-compat alias used by older imports
export const pricing = devicePricing;

export const staff = [
  { id: 's1', full_name: 'Nabeel Nasir', email: 'nabeelnasir165@gmail.com', role: 'Admin',      is_active: true,  created_at: '2024-01-04T10:00:00Z' },
  { id: 's2', full_name: 'Mike Tucker',  email: 'mike@spidermobiles.co.uk', role: 'Technician', is_active: true,  created_at: '2024-03-12T10:00:00Z' },
  { id: 's3', full_name: 'Priya Shah',   email: 'priya@spidermobiles.co.uk',role: 'Technician', is_active: true,  created_at: '2024-06-21T10:00:00Z' },
  { id: 's4', full_name: 'James Holt',   email: 'james@spidermobiles.co.uk',role: 'Front Desk', is_active: true,  created_at: '2024-09-02T10:00:00Z' },
  { id: 's5', full_name: 'Leah Cole',    email: 'leah@spidermobiles.co.uk', role: 'Front Desk', is_active: false, created_at: '2025-01-15T10:00:00Z' },
];

// CMS content (homepage hero, FAQs, promotions, contact, inventory, settings)
export const cmsContent = {
  homepage_hero: {
    headline: 'Spider Mobiles - Expert Repairs in Derby',
    subheading: 'Established in 2013. We are a small mobile repair store located in the heart of Allenton Derby, rated 4.9 stars by our satisfied customers.',
    ctaText: 'Book a Repair',
  },
  faqs: [
    { question: 'Do you use original Apple parts?',           answer: 'Yes, we use Genuine Apple parts provided through the Independent Repair Provider program, as well as high-quality aftermarket options if requested.' },
    { question: 'How long does a screen repair take?',         answer: 'Most screen repairs are completed within 30–45 minutes of drop-off.' },
    { question: 'Do you offer a warranty?',                    answer: 'All repairs come with a 90-day warranty against defects in our workmanship and the parts we supply.' },
    { question: 'Can I post my device in for repair?',          answer: 'Yes — get in touch and we will email you a pre-paid postal repair pack.' },
  ],
  promotions: {
    active: true,
    bannerText: 'Get 10% off all screen repairs this week!',
    discountCode: 'SCREEN10',
  },
  contact: {
    phone:   '01332 986446',
    email:   'hello@spidermobiles.co.uk',
    address: '835 Osmaston Road, Derby, United Kingdom',
  },
  inventory: [
    { partName: 'iPhone 13 Screen (OLED)',      stock: 15, reorderLevel: 5 },
    { partName: 'iPhone 13 Battery',             stock:  3, reorderLevel: 5 },
    { partName: 'iPhone 14 Screen (OLED)',      stock:  8, reorderLevel: 5 },
    { partName: 'Samsung S21 Charging Port',     stock:  8, reorderLevel: 10 },
    { partName: 'Pixel 8 Camera Lens',           stock: 12, reorderLevel: 5 },
    { partName: 'Universal MagSafe Charger',     stock: 22, reorderLevel: 10 },
  ],
  app_settings: {
    businessName: 'Spider Mobiles',
    supportEmail: 'hello@spidermobiles.co.uk',
    businessAddress: '835 Osmaston Road, Derby, United Kingdom',
    emailNotifications: true,
    smsAlerts: true,
  },
};

// Pre-computed dashboard metrics
export const metrics = {
  todaysRepairs: 3,
  revenueToday: 270,
  pendingPayments: 2,
  readyForPickup: 1,
  newBookings: bookings.filter((b) => b.status === 'Pending').length,
  overdueCount: 1,
  overdueAmount: 85,
};
