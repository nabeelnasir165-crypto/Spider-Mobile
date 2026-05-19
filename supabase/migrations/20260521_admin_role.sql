-- ============================================================
-- ADMIN ROLE + DASHBOARD ACCESS POLICIES
-- Run AFTER 20260519_customer_auth.sql
-- ============================================================

-- 1. Add is_admin flag to customer_profiles
-- ------------------------------------------------------------
alter table public.customer_profiles
  add column if not exists is_admin boolean not null default false;

create index if not exists idx_customer_profiles_is_admin
  on public.customer_profiles (is_admin)
  where is_admin = true;


-- 2. Helper function: am I an admin?
--    SECURITY DEFINER so RLS policies can call it without recursion
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.customer_profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;


-- 3. RLS policies — admins see/update everything
-- ------------------------------------------------------------

-- Bookings: admins can SELECT + UPDATE all rows
drop policy if exists "Admins can view all bookings" on public.bookings;
create policy "Admins can view all bookings"
  on public.bookings for select
  using (public.is_admin());

drop policy if exists "Admins can update all bookings" on public.bookings;
create policy "Admins can update all bookings"
  on public.bookings for update
  using (public.is_admin())
  with check (public.is_admin());

-- Customer profiles: admins can view all
drop policy if exists "Admins can view all profiles" on public.customer_profiles;
create policy "Admins can view all profiles"
  on public.customer_profiles for select
  using (public.is_admin());


-- 4. Make yourself an admin — replace the email below and run this
--    line by itself in the SQL editor:
-- ------------------------------------------------------------
-- update public.customer_profiles
-- set is_admin = true
-- where email = 'nabeelnasir165@gmail.com';

-- ============================================================
-- After running this migration:
--   1. Make your own account an admin (uncomment + run the UPDATE above)
--   2. Refresh the website — an "Admin" link will appear in the navbar
--   3. Visit /admin to see the dashboard
-- ============================================================
