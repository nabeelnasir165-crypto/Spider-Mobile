// Browser-side persistence for admin actions that don't have a backend yet.
// Lets newly created tickets, status changes and draft customers survive
// page reloads, so the dashboard feels real even on the demo deploy.
//
// Everything lives in localStorage under namespaced keys. Each helper is
// safe to call during SSR / Node (returns sensible defaults).

const KEY = {
  tickets:        'sm.admin.tickets',         // [{ ...ticketRow }]
  bookingStatus:  'sm.admin.bookingStatus',   // { [bookingId]: 'Pending' | 'Converted' | ... }
  customers:      'sm.admin.customers',       // [{ id, full_name, email, phone, ... }]
};

const readJson = (key, fallback) => {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private-mode errors
  }
};

// ---------- Tickets ----------
export const getStoredTickets = () => readJson(KEY.tickets, []);

export const saveTicket = (ticket) => {
  const current = getStoredTickets();
  // Prepend so newest shows first
  const next = [ticket, ...current.filter((t) => t.id !== ticket.id)];
  writeJson(KEY.tickets, next);
  return next;
};

// ---------- Booking status overrides ----------
export const getBookingStatusOverrides = () =>
  readJson(KEY.bookingStatus, {});

export const setBookingStatus = (bookingId, status) => {
  if (!bookingId) return;
  const current = getBookingStatusOverrides();
  writeJson(KEY.bookingStatus, { ...current, [bookingId]: status });
};

// Apply overrides to a list of bookings (mock or live)
export const applyBookingOverrides = (bookings) => {
  const overrides = getBookingStatusOverrides();
  return bookings.map((b) =>
    overrides[b.id] ? { ...b, status: overrides[b.id] } : b
  );
};

// ---------- Customer drafts ----------
export const getStoredCustomers = () => readJson(KEY.customers, []);

export const saveCustomer = (customer) => {
  const current = getStoredCustomers();
  const next = [customer, ...current.filter((c) => c.id !== customer.id)];
  writeJson(KEY.customers, next);
  return next;
};
