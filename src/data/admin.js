// Local mock data for the admin dashboard.
// Replaces the Supabase queries so the dashboard works without any backend.

export const customers = [
  { id: 'c1', full_name: 'Sarah Jenkins',  email: 'sarah.j@example.com', phone: '+44 7700 900077', address: '12 High St, London', is_business_account: false, created_at: '2026-05-14T10:00:00Z' },
  { id: 'c2', full_name: 'David Chen',     email: 'david.c@example.com', phone: '+44 7700 900088', address: '45 Baker St, London', is_business_account: true,  created_at: '2026-05-12T09:00:00Z' },
  { id: 'c3', full_name: 'Emma Watson',    email: 'emma.w@example.com',  phone: '+44 7700 900099', address: '88 Oxford St, London', is_business_account: false, created_at: '2026-05-10T15:00:00Z' },
  { id: 'c4', full_name: 'Marcus Brown',   email: 'marcus.b@example.com',phone: '+44 7700 900111', address: '5 Park Lane, Derby',   is_business_account: false, created_at: '2026-05-15T11:00:00Z' },
  { id: 'c5', full_name: 'Olivia Pearson', email: 'olivia.p@example.com',phone: '+44 7700 900222', address: '7 Friar Gate, Derby',  is_business_account: false, created_at: '2026-05-16T13:00:00Z' },
  { id: 'c6', full_name: 'Hannah Marsh',   email: 'hannah.m@example.com',phone: '+44 7700 900333', address: '1 Iron Gate, Derby',   is_business_account: false, created_at: '2026-05-17T16:00:00Z' },
];

const findCustomer = (id) => customers.find((c) => c.id === id);

export const tickets = [
  { id: 't1', ticket_ref: 'REP-1042', customer_id: 'c1', device_brand: 'Apple',   device_model: 'iPhone 13 Pro',  device_imei: '354892019384721', reported_issues: ['Screen Damage'],    status: 'Repairing', payment_status: 'Paid',   estimated_price: 185, assigned_tech: 'Mike T.',   created_at: '2026-05-19T08:30:00Z' },
  { id: 't2', ticket_ref: 'REP-1041', customer_id: 'c2', device_brand: 'Apple',   device_model: 'MacBook Air M1', device_imei: 'C02XD4A5JGH6',    reported_issues: ['Battery Drain'],    status: 'Completed', payment_status: 'Unpaid', estimated_price: 85,  assigned_tech: 'Priya S.',  created_at: '2026-05-19T09:00:00Z' },
  { id: 't3', ticket_ref: 'REP-1040', customer_id: 'c3', device_brand: 'Samsung', device_model: 'Galaxy S21',      device_imei: '359992019384721', reported_issues: ['Charging Port'],    status: 'Completed', payment_status: 'Paid',   estimated_price: 65,  assigned_tech: 'James H.',  created_at: '2026-05-19T10:30:00Z' },
  { id: 't4', ticket_ref: 'REP-1039', customer_id: 'c4', device_brand: 'Google',  device_model: 'Pixel 8',          device_imei: '352099001761481', reported_issues: ['Camera Lens'],      status: 'Diagnosed', payment_status: 'Unpaid', estimated_price: 75,  assigned_tech: 'Mike T.',   created_at: '2026-05-18T11:00:00Z' },
  { id: 't5', ticket_ref: 'REP-1038', customer_id: 'c5', device_brand: 'Apple',   device_model: 'iPhone 14',        device_imei: '353919019173821', reported_issues: ['Water Damage'],     status: 'Ready',     payment_status: 'Paid',   estimated_price: 120, assigned_tech: 'Priya S.',  created_at: '2026-05-18T14:00:00Z' },
  { id: 't6', ticket_ref: 'REP-1037', customer_id: 'c1', device_brand: 'Apple',   device_model: 'iPhone 12 Pro Max',device_imei: '352099001999333', reported_issues: ['Back Glass'],       status: 'Completed', payment_status: 'Paid',   estimated_price: 99,  assigned_tech: 'James H.',  created_at: '2026-05-17T15:00:00Z' },
  { id: 't7', ticket_ref: 'REP-1036', customer_id: 'c6', device_brand: 'OnePlus', device_model: '11',               device_imei: '861500050501234', reported_issues: ['Speaker / Mic'],    status: 'Booked',    payment_status: 'Unpaid', estimated_price: 40,  assigned_tech: '',          created_at: '2026-05-17T17:00:00Z' },
  { id: 't8', ticket_ref: 'REP-1035', customer_id: 'c2', device_brand: 'Apple',   device_model: 'iPad Air',         device_imei: 'DMPGV2X8GHV5',    reported_issues: ['Screen Damage'],    status: 'Repairing', payment_status: 'Paid',   estimated_price: 145, assigned_tech: 'Mike T.',   created_at: '2026-05-16T10:00:00Z' },
];

// Attach customer object to ticket (matches the Supabase join shape used by the dashboard)
export const ticketsWithCustomer = tickets.map((t) => ({
  ...t,
  customers: findCustomer(t.customer_id) || null,
}));

export const bookings = [
  { id: 'b1', booking_ref: 'SM-2451', customer_name: 'Olivia Pearson', customer_email: 'olivia.p@example.com', customer_phone: '+44 7700 900222', service_requested: 'Screen Repair',    requested_date: '2026-05-20T16:30:00Z', status: 'Pending',   created_at: '2026-05-19T13:10:00Z' },
  { id: 'b2', booking_ref: 'SM-2469', customer_name: 'Daniel Reed',    customer_email: 'd.reed@example.com',   customer_phone: '+44 7700 900444', service_requested: 'Battery Swap',     requested_date: '2026-05-21T11:00:00Z', status: 'Confirmed', created_at: '2026-05-19T09:45:00Z' },
  { id: 'b3', booking_ref: 'SM-2484', customer_name: 'Hannah Marsh',   customer_email: 'hannah.m@example.com', customer_phone: '+44 7700 900333', service_requested: 'Charging Port',    requested_date: '2026-05-22T10:00:00Z', status: 'Pending',   created_at: '2026-05-19T15:20:00Z' },
  { id: 'b4', booking_ref: 'SM-2491', customer_name: 'Mark Davies',    customer_email: 'mark.d@example.com',   customer_phone: '+44 7700 900555', service_requested: 'Diagnostics',      requested_date: '2026-05-20T09:00:00Z', status: 'Converted', created_at: '2026-05-18T12:00:00Z' },
];

export const pricing = [
  { id: 'p1', brand: 'Apple',   model: 'iPhone 15 Pro',  repair_type: 'Screen Replacement', cost_price: 95, retail_price: 189 },
  { id: 'p2', brand: 'Apple',   model: 'iPhone 14',      repair_type: 'Screen Replacement', cost_price: 70, retail_price: 139 },
  { id: 'p3', brand: 'Apple',   model: 'iPhone 13',      repair_type: 'Battery Replacement',cost_price: 22, retail_price:  59 },
  { id: 'p4', brand: 'Samsung', model: 'Galaxy S24',     repair_type: 'Screen Replacement', cost_price: 95, retail_price: 175 },
  { id: 'p5', brand: 'Samsung', model: 'Galaxy S22',     repair_type: 'Charging Port',      cost_price: 18, retail_price:  55 },
  { id: 'p6', brand: 'Google',  model: 'Pixel 8',         repair_type: 'Camera Lens',        cost_price: 28, retail_price:  69 },
  { id: 'p7', brand: 'OnePlus', model: '11',              repair_type: 'Battery Replacement',cost_price: 24, retail_price:  55 },
];

export const staff = [
  { id: 's1', full_name: 'Nabeel Nasir', email: 'nabeelnasir165@gmail.com', role: 'Admin',      is_active: true,  created_at: '2024-01-04T10:00:00Z' },
  { id: 's2', full_name: 'Mike Tucker',  email: 'mike@spidermobiles.co.uk', role: 'Technician', is_active: true,  created_at: '2024-03-12T10:00:00Z' },
  { id: 's3', full_name: 'Priya Shah',   email: 'priya@spidermobiles.co.uk',role: 'Technician', is_active: true,  created_at: '2024-06-21T10:00:00Z' },
  { id: 's4', full_name: 'James Holt',   email: 'james@spidermobiles.co.uk',role: 'Front Desk', is_active: true,  created_at: '2024-09-02T10:00:00Z' },
  { id: 's5', full_name: 'Leah Cole',    email: 'leah@spidermobiles.co.uk', role: 'Front Desk', is_active: false, created_at: '2025-01-15T10:00:00Z' },
];

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
