-- ============================================================
-- Allow email-OR-phone signup
-- Run AFTER 20260519_customer_auth.sql
-- ============================================================

-- 1. Make email nullable, add phone uniqueness, require at least one identifier
alter table public.customer_profiles
  alter column email drop not null;

-- Drop any existing constraint if you re-run this; safe to ignore if missing.
do $$
begin
  alter table public.customer_profiles drop constraint if exists customer_profiles_identifier_required;
exception when undefined_object then null;
end $$;

alter table public.customer_profiles
  add constraint customer_profiles_identifier_required
  check (email is not null or phone is not null);

-- Phone is unique (allowing nulls)
create unique index if not exists customer_profiles_phone_unique
  on public.customer_profiles (phone)
  where phone is not null;


-- 2. Trigger now reads email AND phone from the auth.users row (Supabase
--    populates both columns natively), plus full_name from metadata.
create or replace function public.handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customer_profiles (id, email, phone, full_name)
  values (
    new.id,
    nullif(new.email, ''),
    nullif(coalesce(new.phone, new.raw_user_meta_data->>'phone'), ''),
    nullif(coalesce(new.raw_user_meta_data->>'full_name', ''), '')
  )
  on conflict (id) do update set
    email     = coalesce(excluded.email,     public.customer_profiles.email),
    phone     = coalesce(excluded.phone,     public.customer_profiles.phone),
    full_name = coalesce(excluded.full_name, public.customer_profiles.full_name);
  return new;
end;
$$;

-- ============================================================
-- Notes
--   * Email confirmation still depends on your custom SMTP config.
--   * Phone signup uses SMS OTP, which requires an SMS provider
--     (Twilio / MessageBird / Vonage) configured in Supabase Auth.
--     Without one, phone signup will return a "phone provider" error
--     and the UI will guide the user to use email instead.
-- ============================================================
