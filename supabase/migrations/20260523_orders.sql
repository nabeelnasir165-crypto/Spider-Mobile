-- ============================================================
-- Orders: cart/checkout persistence
-- Run AFTER 20260519/20260520/20260521/20260522 migrations.
-- Idempotent — safe to re-run.
-- ============================================================

-- 1. Orders table
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_ref         text unique not null,
  customer_user_id  uuid references auth.users(id) on delete set null,
  customer_name     text,
  customer_email    text,
  customer_phone    text,
  delivery_method   text default 'collection',
  delivery_address  text,
  payment_method    text default 'stripe',
  payment_status    text default 'pending',
  subtotal          numeric(10,2) not null default 0,
  delivery_fee      numeric(10,2) not null default 0,
  total             numeric(10,2) not null default 0,
  items             jsonb not null default '[]',
  status            text default 'Pending',
  notes             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
create index if not exists idx_orders_customer on public.orders (customer_user_id);
create index if not exists idx_orders_status   on public.orders (status);
create index if not exists idx_orders_created  on public.orders (created_at desc);

-- 2. Updated-at trigger
create or replace function public.set_orders_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_orders_updated_at();

-- 3. RLS — customers see their own, admins see all
alter table public.orders enable row level security;

drop policy if exists "Customers can insert their own orders"   on public.orders;
drop policy if exists "Customers read their own orders"          on public.orders;
drop policy if exists "Guest checkout inserts"                   on public.orders;
drop policy if exists "Admins read all orders"                   on public.orders;
drop policy if exists "Admins update orders"                     on public.orders;
drop policy if exists "Admins delete orders"                     on public.orders;

-- Guest checkout: anyone may insert (we trust the client-set order_ref to be unique;
-- if you want stricter, require auth and remove this policy).
create policy "Guest checkout inserts"
  on public.orders for insert
  with check (true);

create policy "Customers read their own orders"
  on public.orders for select
  using (auth.uid() is not null and customer_user_id = auth.uid());

create policy "Admins read all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins update orders"
  on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins delete orders"
  on public.orders for delete
  using (public.is_admin());

-- ============================================================
-- Verify:
--   select order_ref, customer_email, total, payment_status, status
--     from public.orders order by created_at desc limit 5;
-- ============================================================
