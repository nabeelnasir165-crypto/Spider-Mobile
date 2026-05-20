-- ============================================================
-- Remaining admin tables: device_pricing, staff, cms_content
-- Run AFTER 20260519/20260520/20260521 migrations.
-- Idempotent — safe to re-run.
-- ============================================================

-- 1. device_pricing — repair price book by brand/model/repair_type
create table if not exists public.device_pricing (
  id           uuid primary key default gen_random_uuid(),
  brand        text not null,
  model        text not null,
  repair_type  text not null,
  cost_price   numeric(10,2) default 0,
  retail_price numeric(10,2) not null default 0,
  created_at   timestamptz default now(),
  unique (brand, model, repair_type)
);
create index if not exists idx_device_pricing_brand on public.device_pricing (brand);


-- 2. staff — team directory
create table if not exists public.staff (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text unique,
  role        text default 'Technician',
  is_active   boolean default true,
  created_at  timestamptz default now()
);


-- 3. cms_content — JSON blob per section (homepage hero, FAQs, settings, etc.)
create table if not exists public.cms_content (
  id           uuid primary key default gen_random_uuid(),
  section_key  text unique not null,
  content      jsonb not null,
  updated_at   timestamptz default now()
);


-- 4. Admin-only RLS (delegates to is_admin() from 20260521_admin_role.sql)
alter table public.device_pricing enable row level security;
alter table public.staff          enable row level security;
alter table public.cms_content    enable row level security;

-- device_pricing
drop policy if exists "Admins read device_pricing"   on public.device_pricing;
drop policy if exists "Admins write device_pricing"  on public.device_pricing;
drop policy if exists "Admins update device_pricing" on public.device_pricing;
drop policy if exists "Admins delete device_pricing" on public.device_pricing;
create policy "Admins read device_pricing"   on public.device_pricing for select using (public.is_admin());
create policy "Admins write device_pricing"  on public.device_pricing for insert with check (public.is_admin());
create policy "Admins update device_pricing" on public.device_pricing for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete device_pricing" on public.device_pricing for delete using (public.is_admin());

-- staff
drop policy if exists "Admins read staff"   on public.staff;
drop policy if exists "Admins write staff"  on public.staff;
drop policy if exists "Admins update staff" on public.staff;
create policy "Admins read staff"   on public.staff for select using (public.is_admin());
create policy "Admins write staff"  on public.staff for insert with check (public.is_admin());
create policy "Admins update staff" on public.staff for update using (public.is_admin()) with check (public.is_admin());

-- cms_content
drop policy if exists "Admins read cms"   on public.cms_content;
drop policy if exists "Admins write cms"  on public.cms_content;
drop policy if exists "Admins update cms" on public.cms_content;
create policy "Admins read cms"   on public.cms_content for select using (public.is_admin());
create policy "Admins write cms"  on public.cms_content for insert with check (public.is_admin());
create policy "Admins update cms" on public.cms_content for update using (public.is_admin()) with check (public.is_admin());


-- 5. Seed data (matches src/data/admin.js so the admin UI is non-empty)
insert into public.device_pricing (brand, model, repair_type, cost_price, retail_price) values
  ('Apple',   'iPhone 15 Pro Max', 'Screen Replacement',  110, 199),
  ('Apple',   'iPhone 15 Pro Max', 'Battery Replacement',  35,  79),
  ('Apple',   'iPhone 15 Pro Max', 'Back Glass',           45,  99),
  ('Apple',   'iPhone 14',         'Screen Replacement',   70, 139),
  ('Apple',   'iPhone 14',         'Battery Replacement',  25,  59),
  ('Apple',   'iPhone 13',         'Screen Replacement',   60, 119),
  ('Apple',   'iPhone 13',         'Battery Replacement',  22,  55),
  ('Apple',   'iPhone 12',         'Screen Replacement',   50,  99),
  ('Samsung', 'Galaxy S24 Ultra',  'Screen Replacement',  110, 199),
  ('Samsung', 'Galaxy S24 Ultra',  'Battery Replacement',  30,  69),
  ('Samsung', 'Galaxy S23',        'Screen Replacement',   90, 165),
  ('Samsung', 'Galaxy S22',        'Charging Port',        18,  55),
  ('Samsung', 'Galaxy A54',        'Screen Replacement',   55, 109),
  ('Google',  'Pixel 8 Pro',       'Screen Replacement',   80, 149),
  ('Google',  'Pixel 8',           'Camera Lens',          28,  69),
  ('Google',  'Pixel 7',           'Battery Replacement',  22,  55),
  ('Huawei',  'P60 Pro',           'Screen Replacement',   70, 139),
  ('Huawei',  'Mate 50',           'Battery Replacement',  25,  65),
  ('Other',   'OnePlus 11',        'Battery Replacement',  24,  55),
  ('Other',   'Xiaomi 14',         'Screen Replacement',   60, 119)
on conflict (brand, model, repair_type) do nothing;

insert into public.staff (full_name, email, role, is_active) values
  ('Nabeel Nasir', 'nabeelnasir165@gmail.com',  'Admin',      true),
  ('Mike Tucker',  'mike@spidermobiles.co.uk',  'Technician', true),
  ('Priya Shah',   'priya@spidermobiles.co.uk', 'Technician', true),
  ('James Holt',   'james@spidermobiles.co.uk', 'Front Desk', true),
  ('Leah Cole',    'leah@spidermobiles.co.uk',  'Front Desk', false)
on conflict (email) do nothing;

insert into public.cms_content (section_key, content) values
  ('homepage_hero', '{"headline":"Spider Mobiles - Expert Repairs in Derby","subheading":"Established in 2013. We are a small mobile repair store located in the heart of Allenton Derby, rated 4.9 stars by our satisfied customers.","ctaText":"Book a Repair"}'),
  ('faqs', '[{"question":"Do you use original Apple parts?","answer":"Yes, we use Genuine Apple parts provided through the Independent Repair Provider program, as well as high-quality aftermarket options if requested."},{"question":"How long does a screen repair take?","answer":"Most screen repairs are completed within 30–45 minutes of drop-off."},{"question":"Do you offer a warranty?","answer":"All repairs come with a 90-day warranty against defects in our workmanship and the parts we supply."},{"question":"Can I post my device in for repair?","answer":"Yes — get in touch and we will email you a pre-paid postal repair pack."}]'),
  ('promotions', '{"active":true,"bannerText":"Get 10% off all screen repairs this week!","discountCode":"SCREEN10"}'),
  ('contact', '{"phone":"01332 986446","email":"hello@spidermobiles.co.uk","address":"835 Osmaston Road, Derby, United Kingdom"}'),
  ('inventory', '[{"partName":"iPhone 13 Screen (OLED)","stock":15,"reorderLevel":5},{"partName":"iPhone 13 Battery","stock":3,"reorderLevel":5},{"partName":"iPhone 14 Screen (OLED)","stock":8,"reorderLevel":5},{"partName":"Samsung S21 Charging Port","stock":8,"reorderLevel":10},{"partName":"Pixel 8 Camera Lens","stock":12,"reorderLevel":5},{"partName":"Universal MagSafe Charger","stock":22,"reorderLevel":10}]'),
  ('app_settings', '{"businessName":"Spider Mobiles","supportEmail":"hello@spidermobiles.co.uk","businessAddress":"835 Osmaston Road, Derby, United Kingdom","emailNotifications":true,"smsAlerts":true}')
on conflict (section_key) do nothing;

-- ============================================================
-- Verify:
--   select brand, count(*) from public.device_pricing group by brand;
--   select count(*) from public.staff;
--   select section_key from public.cms_content order by section_key;
-- ============================================================
