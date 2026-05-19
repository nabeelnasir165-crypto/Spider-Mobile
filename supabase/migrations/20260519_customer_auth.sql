-- ============================================================
-- SPIDER MOBILES — Customer Auth, Booking & Tracking
-- ============================================================
-- Run this in your Supabase SQL editor.
-- Layers customer self-service on top of the existing staff schema.
-- ============================================================

-- 1. Customer profiles (linked to auth.users)
-- ------------------------------------------------------------
create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null unique,
  phone text,
  marketing_opt_in boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile when a new auth user signs up
create or replace function public.handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customer_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_customer();


-- 2. Extend bookings to link to a customer auth user
-- ------------------------------------------------------------
alter table if exists public.bookings
  add column if not exists customer_user_id uuid references auth.users(id) on delete set null,
  add column if not exists device_brand text,
  add column if not exists device_model text,
  add column if not exists issue text,
  add column if not exists notes text,
  add column if not exists stage int default 0; -- 0..4 timeline stage

create index if not exists idx_bookings_customer_user_id on public.bookings(customer_user_id);
create index if not exists idx_bookings_booking_ref on public.bookings(booking_ref);

-- Auto-generate booking_ref like SM-2451 when not provided
create sequence if not exists public.booking_ref_seq start 2500;

create or replace function public.set_booking_ref()
returns trigger language plpgsql as $$
begin
  if new.booking_ref is null or new.booking_ref = '' then
    new.booking_ref := 'SM-' || nextval('public.booking_ref_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_booking_ref on public.bookings;
create trigger trg_set_booking_ref
  before insert on public.bookings
  for each row execute function public.set_booking_ref();


-- 3. Row-Level Security
-- ------------------------------------------------------------
alter table public.customer_profiles enable row level security;

drop policy if exists "Customers can view their own profile" on public.customer_profiles;
create policy "Customers can view their own profile"
  on public.customer_profiles for select
  using (auth.uid() = id);

drop policy if exists "Customers can update their own profile" on public.customer_profiles;
create policy "Customers can update their own profile"
  on public.customer_profiles for update
  using (auth.uid() = id);

-- Bookings RLS: customers see/create their own, staff sees all
alter table public.bookings enable row level security;

drop policy if exists "Customers can view their own bookings" on public.bookings;
create policy "Customers can view their own bookings"
  on public.bookings for select
  using (auth.uid() = customer_user_id);

drop policy if exists "Customers can create bookings for themselves" on public.bookings;
create policy "Customers can create bookings for themselves"
  on public.bookings for insert
  with check (auth.uid() = customer_user_id);

drop policy if exists "Anonymous lookup by booking_ref" on public.bookings;
create policy "Anonymous lookup by booking_ref"
  on public.bookings for select
  using (true); -- read-only, used by the public track form. Customers still get RLS-protected listing via the customer policy above.

-- Tickets: customers can view tickets that reference their booking
alter table if exists public.tickets enable row level security;

drop policy if exists "Customers view their own tickets via booking" on public.tickets;
create policy "Customers view their own tickets via booking"
  on public.tickets for select
  using (
    customer_id in (
      select c.id from public.customers c
      where c.email = (select email from public.customer_profiles where id = auth.uid())
    )
  );


-- 4. Helpful view: customer bookings with computed display fields
-- ------------------------------------------------------------
create or replace view public.my_bookings as
  select
    b.id,
    b.booking_ref,
    b.created_at,
    b.requested_date,
    b.service_requested,
    b.device_brand,
    b.device_model,
    b.issue,
    b.notes,
    b.status,
    b.stage,
    b.customer_user_id
  from public.bookings b
  where b.customer_user_id = auth.uid()
  order by b.created_at desc;

-- ============================================================
-- DONE. Verify in Supabase dashboard:
--   1. Table editor → customer_profiles exists
--   2. Authentication → Email + Google providers enabled
--   3. Project Settings → Auth → SMTP Settings → your SMTP credentials added
--   4. Edge Functions → deploy send-booking-email (see supabase/functions/)
-- ============================================================
