# Spider Mobiles — Hybrid Repair Suite V1 (Dashboard Package)

> **Purpose**: Use this file as a prompt in Claude Code to recreate the Spider Mobiles admin dashboard in any project.

---

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: react-router-dom v7
- **Styling**: Tailwind CSS v3 + PostCSS + Autoprefixer
- **Backend**: Supabase (Auth, Database, RLS)
- **Icons**: Google Material Symbols Outlined (loaded via Google Fonts CDN)
- **Typography**: Inter + JetBrains Mono (Google Fonts CDN)
- **Animation**: framer-motion v12
- **Icons (React)**: lucide-react v1

---

## Package.json

```json
{
  "name": "spider-mobile-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 5173 --strictPort --open /",
    "dev:admin": "vite --port 5180 --strictPort --open /admin",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.106.0",
    "framer-motion": "^12.39.0",
    "lucide-react": "^1.16.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "postcss": "^8.5.14",
    "tailwindcss": "^3.4.19",
    "vite": "^8.0.12"
  }
}
```

## Vite Config (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })
```

## PostCSS Config (`postcss.config.js`)

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

---

## Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── .env.local
├── supabase_schema.sql
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── og-image.svg
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── lib/
    │   └── supabaseClient.js
    ├── contexts/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── Layout.jsx          ← Admin sidebar + topnav
    │   ├── AdminRoute.jsx      ← Auth guard for /admin
    │   ├── ProtectedRoute.jsx
    │   ├── SiteLayout.jsx
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   └── ...
    ├── data/
    │   └── admin.js            ← Mock data (customers, tickets, bookings, pricing, staff)
    └── pages/
        ├── Dashboard.jsx       ← /admin (overview, metrics, active repairs table)
        ├── AllRepairs.jsx      ← /admin/repairs
        ├── CustomerDatabase.jsx← /admin/customers
        ├── NewRepairTicket.jsx ← /admin/new-ticket
        ├── TicketDetails.jsx   ← /admin/ticket/:id
        ├── Bookings.jsx        ← /admin/bookings
        ├── Pricing.jsx         ← /admin/pricing
        ├── CMS.jsx             ← /admin/cms
        ├── Payments.jsx        ← /admin/payments
        ├── Warranty.jsx        ← /admin/warranty
        ├── Staff.jsx           ← /admin/staff
        └── Settings.jsx        ← /admin/settings
```

---

## Environment Variables (`.env.local`)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Supabase Schema (`supabase_schema.sql`)

```sql
CREATE TABLE staff (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'Technician',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  is_business_account BOOLEAN DEFAULT FALSE,
  notes TEXT
);

CREATE TABLE device_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  repair_type TEXT NOT NULL,
  cost_price DECIMAL(10,2) DEFAULT 0,
  retail_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_ref TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  device_brand TEXT,
  device_model TEXT,
  device_imei TEXT,
  device_passcode TEXT,
  reported_issues TEXT[],
  condition_checklist JSONB,
  accessories_received TEXT[],
  status TEXT DEFAULT 'Booked',
  assigned_tech TEXT,
  estimated_price DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'Unpaid',
  delivery_info JSONB,
  parts_consumed JSONB
);

CREATE TABLE ticket_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  is_status_update BOOLEAN DEFAULT FALSE
);

CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  requested_date TIMESTAMP WITH TIME ZONE,
  service_requested TEXT,
  status TEXT DEFAULT 'Pending'
);

CREATE TABLE cms_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies: All tables use authenticated-only SELECT/INSERT/UPDATE
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_notes ENABLE ROW LEVEL SECURITY;
```

---

## Tailwind Config — Key Design Tokens

The admin dashboard uses **Material Design 3** color tokens. Key colors:

```js
// tailwind.config.js → theme.extend.colors (admin-specific tokens)
{
  "primary": "#005bbf",
  "primary-container": "#1a73e8",
  "on-primary": "#ffffff",
  "on-primary-container": "#ffffff",
  "secondary": "#505f76",
  "secondary-container": "#d0e1fb",
  "tertiary": "#9e4300",
  "tertiary-container": "#c55500",
  "error": "#ba1a1a",
  "error-container": "#ffdad6",
  "surface": "#f9f9ff",
  "surface-container": "#ecedf7",
  "surface-container-lowest": "#ffffff",
  "surface-container-low": "#f2f3fd",
  "surface-container-high": "#e6e8f2",
  "surface-container-highest": "#e0e2ec",
  "surface-bright": "#f9f9ff",
  "on-surface": "#191c23",
  "on-surface-variant": "#414754",
  "outline": "#727785",
  "outline-variant": "#c1c6d6",
  "background": "#f9f9ff",
  "inverse-surface": "#2d3038",
}
```

Custom spacing: `xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px`  
Custom font sizes: `label-md: 12px, body-md: 14px, body-lg: 16px, title-lg: 18px, headline-md: 24px, headline-lg: 32px`  
Font family: `Inter` for all text, `JetBrains Mono` for code/refs

---

## Routing Architecture (`App.jsx`)

```jsx
<AuthProvider>
  <BrowserRouter>
    <Routes>
      {/* Customer site under SiteLayout */}
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        {/* ... public pages ... */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
          <Route path="/book" element={<Book />} />
        </Route>
      </Route>

      {/* Admin dashboard — restricted to is_admin users */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="repairs" element={<AllRepairs />} />
          <Route path="customers" element={<CustomerDatabase />} />
          <Route path="new-ticket" element={<NewRepairTicket />} />
          <Route path="ticket/:id" element={<TicketDetails />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="cms" element={<CMS />} />
          <Route path="payments" element={<Payments />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="staff" element={<Staff />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

---

## Admin Layout (`components/Layout.jsx`)

### TopNavBar
- Fixed top bar (`h-16`, `z-50`) with:
  - Logo + "Spider Mobiles · Admin" text linking to `/admin`
  - Notification bell with badge + popup modal (overdue payments, system updates)
  - Help button
  - Profile avatar dropdown (Settings, Sign Out)

### SideNavBar  
- Fixed left sidebar (`w-[260px]`, below top bar)
- Shop name "Spider Mobiles" with version "V1.0.4"
- "New Repair" CTA button at top
- Nav items: Dashboard, Repairs, Customers, Bookings, Pricing, CMS, Payments, Warranty, Staff
- Settings at bottom (mt-auto)
- Active state: `bg-secondary-container` with bold text
- Uses Material Symbols icons

### Main Content Area
- `ml-[260px]` offset, min-height fills viewport
- Background: `#f4f5fb`
- Floating "Create Ticket" FAB at bottom-right (hidden on new-ticket page)

---

## Page Specifications

### 1. Dashboard (`/admin`)
- **Metrics row**: 5 cards (Today's Repairs, Revenue Today, Pending Payments, Ready for Pickup, New Bookings)
- **Active Repairs table**: Shows top 5 tickets with Ticket ID, Customer, Device, Status, Payment, Date, View action
- **Right sidebar**: Alerts panel (overdue unpaid repairs warning) + Quick Actions (New Ticket, Add Customer, Search Repairs)
- Uses local mock data from `data/admin.js`

### 2. All Repairs (`/admin/repairs`)
- Full ticket table with search, status/payment/date filters
- Export CSV button
- Columns: Ticket ID, Customer (with phone/email subtitle), Device (with issues), Status badge, Price, Payment dot, Actions (view/edit on hover)
- Pagination footer

### 3. Customer Database (`/admin/customers`)
- **Split layout**: Left panel (4/12 cols) = searchable customer list, Right panel (8/12 cols) = detail view
- Customer list items show name, B2B badge, email, phone
- Detail view: Avatar with initials, contact info, address, metrics (Total Repairs, Lifetime Value), repair history
- "Add Customer" form with full_name, email, phone, address, is_business_account, notes

### 4. New Repair Ticket (`/admin/new-ticket`)
- **5-step progress indicator** (Customer → Device → Issues → Checklist → Summary)
- Left column (8/12): Customer search/select, Device info (brand select, model, IMEI, passcode), Reported Issues (checkbox grid: Screen Damage, Battery Drain, Charging Port, Water Damage) + notes
- Right column (4/12): Condition Checklist (scratches, dents, powers on), Accessories (SIM Tray, Case, Charger as toggle pills), Summary & Estimate with price input, Create Ticket button
- Supports pre-fill from booking conversion via `location.state.fromBooking`

### 5. Ticket Details (`/admin/ticket/:id`)
- Header: ticket_ref, status badge, Edit button, Back to Repairs link
- Left (8/12): Customer card, Device card, Reported Issues & Condition, Parts Consumed log (add part input), Technician Notes (add note textarea + timeline)
- Right (4/12): Quick Actions (Update Status, Upload Image, Print), Payment Summary (mark as paid), Delivery Tracking (courier name, status select), Warranty info card
- Status Update modal with all status options

### 6. Bookings (`/admin/bookings`)
- Table: Booking Ref, Customer (name + phone), Requested Date/Time, Service, Status badge, "Convert to Ticket" action
- Filters: search, status (Pending/Confirmed/Converted), date range
- Calendar View modal, Export CSV

### 7. Pricing (`/admin/pricing`)
- Left sidebar (2/12): Brand list (Apple, Samsung, Google, Huawei, Other)
- Right (10/12): Cards per model, each with table of services (repair_type, cost_price, retail_price inline-editable)
- Add Device Model, Add Service per model, Delete service

### 8. CMS (`/admin/cms`)
- Tabbed interface: Homepage Editor, FAQs, Promotions, Contact Settings, Inventory
- Homepage: headline, subheading, CTA text inputs
- FAQs: Add/remove/edit question+answer pairs
- Promotions: Enable banner toggle, banner text, discount code
- Contact: Phone, email, address
- Inventory: Parts table (partName, stock, reorderLevel) with low-stock warning
- "Publish Changes" button saves to Supabase `cms_content` table

### 9. Payments (`/admin/payments`)
- 3 metric cards: Revenue Today, Outstanding (Unpaid), Revenue This Month
- Invoice table: Invoice #, Date, Customer, Ticket Ref, Amount, Status badge, View link

### 10. Warranty (`/admin/warranty`)
- Shows completed tickets with auto-calculated 90-day warranty expiry
- Table: Ticket Ref, Customer, Device/Service, Expiry Date, Status (Active/Expired), View Details
- Search + status filter

### 11. Staff (`/admin/staff`)
- Card grid (3 cols): Avatar with initials, name, role, email
- Admin gets primary-container background on avatar
- Edit + Activate/Deactivate buttons per card

### 12. Settings (`/admin/settings`)
- Business Profile: name, support email, address
- Notifications: Email notifications toggle, SMS alerts toggle
- Save Changes button

---

## Mock Data (`data/admin.js`)

Provides offline-first data:
- **6 customers** (Sarah Jenkins, David Chen, Emma Watson, Marcus Brown, Olivia Pearson, Hannah Marsh)
- **8 tickets** (REP-1035 to REP-1042) with various statuses and payment states
- **4 bookings** (SM-2451 to SM-2491)
- **7 pricing entries** across Apple, Samsung, Google, OnePlus
- **5 staff members** (Nabeel Nasir as Admin, 3 active technicians/front desk, 1 inactive)

---

## Auth System (`contexts/AuthContext.jsx`)

- Wraps entire app in `<AuthProvider>`
- Loads session via `supabase.auth.getSession()` with 6s safety timeout
- Listens to `onAuthStateChange`
- Fetches profile from `customer_profiles` table
- Exposes: `session, user, profile, isAdmin, loading, signUp, signIn, signInWithGoogle, signOut, sendPasswordReset, updatePassword, updateProfile`
- `isAdmin` derived from `profile.is_admin`

## AdminRoute Guard (`components/AdminRoute.jsx`)

- Shows spinner while `loading`
- Redirects to `/login` if no user
- Shows "Admin access required" page if `!isAdmin`
- Renders `<Outlet />` if admin

---

## Supabase Client (`lib/supabaseClient.js`)

- Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from env
- Exports `isSupabaseConfigured` boolean (false if placeholder)
- Falls back to placeholder values with console warning
- Auth config: `autoRefreshToken: true, persistSession: true, detectSessionInUrl: true`

---

## External Dependencies (CDN in `index.html`)

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
```

Material Symbols usage pattern:
```html
<span class="material-symbols-outlined">icon_name</span>
```

---

## Design Patterns

1. **Card pattern**: `bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm`
2. **Table header**: `bg-surface-container border-b border-outline-variant` with `font-label-md` columns
3. **Status badges**: Rounded pills with semantic colors (success-container, warning-container, error-container, primary-container)
4. **Primary buttons**: `bg-primary text-on-primary font-label-md rounded-lg hover:opacity-90`
5. **Outline buttons**: `border border-outline-variant text-on-surface hover:bg-surface-container-low`
6. **Search inputs**: Icon left (`material-symbols-outlined`), `pl-xl` padding, `focus:border-primary focus:ring-2 focus:ring-primary/20`
7. **Page layout**: `<main className="h-full overflow-y-auto p-md md:p-xl bg-background">` → `<div className="max-w-container-max mx-auto">`
8. **Page header**: Headline + subtitle on left, action buttons on right, `mb-lg` gap
