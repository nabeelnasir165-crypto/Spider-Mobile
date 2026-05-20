-- ============================================================
-- ADMIN-SIDE TABLES: customers + tickets + ticket_notes
-- Run AFTER 20260519_customer_auth.sql and 20260521_admin_role.sql.
-- Idempotent — safe to re-run.
-- ============================================================

-- 1. customers — admin-managed customer directory (separate from
--    customer_profiles which is auth-linked). The booking → ticket
--    converter looks up by email here.
create table if not exists public.customers (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  email               text unique,
  phone               text,
  address             text,
  is_business_account boolean default false,
  notes               text,
  created_at          timestamptz default now()
);

create index if not exists idx_customers_email on public.customers (email);
create index if not exists idx_customers_phone on public.customers (phone);


-- 2. tickets — the admin repair queue
create table if not exists public.tickets (
  id                   uuid primary key default gen_random_uuid(),
  ticket_ref           text unique not null,
  customer_id          uuid references public.customers(id) on delete set null,
  device_brand         text,
  device_model         text,
  device_imei          text,
  device_passcode      text,
  reported_issues      text[],
  condition_checklist  jsonb,
  accessories_received text[],
  status               text default 'Booked',
  assigned_tech        text,
  estimated_price      numeric(10,2) default 0,
  payment_status       text default 'Unpaid',
  delivery_info        jsonb,
  parts_consumed       jsonb,
  notes                text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create index if not exists idx_tickets_customer_id on public.tickets (customer_id);
create index if not exists idx_tickets_ticket_ref  on public.tickets (ticket_ref);
create index if not exists idx_tickets_status      on public.tickets (status);


-- 3. ticket_notes — timeline notes per ticket
create table if not exists public.ticket_notes (
  id                uuid primary key default gen_random_uuid(),
  ticket_id         uuid references public.tickets(id) on delete cascade,
  author            text not null,
  content           text not null,
  is_status_update  boolean default false,
  created_at        timestamptz default now()
);

create index if not exists idx_ticket_notes_ticket_id on public.ticket_notes (ticket_id);


-- 4. Auto-bump updated_at on ticket updates
create or replace function public.touch_ticket_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_touch_ticket_updated_at on public.tickets;
create trigger trg_touch_ticket_updated_at
  before update on public.tickets
  for each row execute function public.touch_ticket_updated_at();


-- 5. Row-Level Security — admins do everything; nobody else gets access.
--    (Customer-side reads its own data via separate policies already in place.)
alter table public.customers     enable row level security;
alter table public.tickets       enable row level security;
alter table public.ticket_notes  enable row level security;

-- Customers
drop policy if exists "Admins read customers"   on public.customers;
drop policy if exists "Admins write customers"  on public.customers;
drop policy if exists "Admins update customers" on public.customers;
create policy "Admins read customers"   on public.customers for select using (public.is_admin());
create policy "Admins write customers"  on public.customers for insert with check (public.is_admin());
create policy "Admins update customers" on public.customers for update using (public.is_admin()) with check (public.is_admin());

-- Tickets
drop policy if exists "Admins read tickets"   on public.tickets;
drop policy if exists "Admins write tickets"  on public.tickets;
drop policy if exists "Admins update tickets" on public.tickets;
create policy "Admins read tickets"   on public.tickets for select using (public.is_admin());
create policy "Admins write tickets"  on public.tickets for insert with check (public.is_admin());
create policy "Admins update tickets" on public.tickets for update using (public.is_admin()) with check (public.is_admin());

-- Ticket notes
drop policy if exists "Admins read ticket_notes"  on public.ticket_notes;
drop policy if exists "Admins write ticket_notes" on public.ticket_notes;
create policy "Admins read ticket_notes"  on public.ticket_notes for select using (public.is_admin());
create policy "Admins write ticket_notes" on public.ticket_notes for insert with check (public.is_admin());

-- ============================================================
-- DONE.
-- Verify in the SQL editor:
--   select count(*) from public.tickets;     -- 0 to start
--   select count(*) from public.customers;   -- 0 to start
-- ============================================================
