-- 0. Staff / Users Table (Auth Link)
CREATE TABLE staff (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'Technician', -- e.g., 'Admin', 'Technician', 'Front Desk'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS on all tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_notes ENABLE ROW LEVEL SECURITY;

-- Staff Policies
CREATE POLICY "Staff can view all staff" ON staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff can update own profile" ON staff FOR UPDATE USING (auth.uid() = id);

-- Customers Policies
CREATE POLICY "Authenticated users can view customers" ON customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert customers" ON customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update customers" ON customers FOR UPDATE USING (auth.role() = 'authenticated');

-- Tickets Policies
CREATE POLICY "Authenticated users can view tickets" ON tickets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert tickets" ON tickets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update tickets" ON tickets FOR UPDATE USING (auth.role() = 'authenticated');

-- Ticket Notes Policies
CREATE POLICY "Authenticated users can view notes" ON ticket_notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert notes" ON ticket_notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 1. Customers Table
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

-- 2. Devices/Pricing Configuration Table
CREATE TABLE device_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL, -- e.g., 'Apple', 'Samsung'
  model TEXT NOT NULL, -- e.g., 'iPhone 13 Pro'
  repair_type TEXT NOT NULL, -- e.g., 'Screen Replacement'
  cost_price DECIMAL(10,2) DEFAULT 0,
  retail_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tickets (Repairs) Table
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_ref TEXT UNIQUE NOT NULL, -- e.g., 'REP-1042'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  device_brand TEXT,
  device_model TEXT,
  device_imei TEXT,
  device_passcode TEXT,
  reported_issues TEXT[], -- array of faults
  condition_checklist JSONB, -- stores scratches, power status, etc.
  accessories_received TEXT[], -- e.g., ['Case', 'SIM']
  status TEXT DEFAULT 'Booked', -- Booked, Received, Diagnosed, Repairing, Ready, Completed
  assigned_tech TEXT,
  estimated_price DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'Unpaid', -- Unpaid, Paid
  delivery_info JSONB, -- stores delivery tracking (courier name, status, etc)
  parts_consumed JSONB -- stores parts used for inventory deduction
);

-- 4. Ticket Timeline / Notes Table
CREATE TABLE ticket_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author TEXT NOT NULL, -- e.g., 'Mike T. (Tech)'
  content TEXT NOT NULL,
  is_status_update BOOLEAN DEFAULT FALSE
);

-- 5. Bookings Table (From Website)
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  requested_date TIMESTAMP WITH TIME ZONE,
  service_requested TEXT,
  status TEXT DEFAULT 'Pending' -- Pending, Confirmed, Converted
);

-- 6. CMS Content Table
CREATE TABLE cms_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL, -- e.g., 'homepage_hero', 'faqs'
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
