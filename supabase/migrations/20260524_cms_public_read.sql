-- ============================================================
-- Public-read CMS sections (homepage_hero, faqs, promotions, contact)
-- Lets the customer site fetch these without an authenticated session
-- so the admin can edit them and see changes live on the homepage.
-- Run AFTER 20260522_admin_rest.sql which creates the cms_content table.
-- Idempotent — safe to re-run.
-- ============================================================

drop policy if exists "Public read cms" on public.cms_content;
create policy "Public read cms"
  on public.cms_content for select
  to anon, authenticated
  using (section_key in ('homepage_hero', 'faqs', 'promotions', 'contact'));

-- Also update the seed homepage_hero row to use the split headline fields
-- so the hero keeps its gradient "Repairs." accent until an admin edits it.
update public.cms_content
   set content = jsonb_set(
     jsonb_set(content::jsonb, '{headline_top}',    '"Fast. Trusted."'::jsonb, true),
                                '{headline_accent}', '"Repairs."'::jsonb, true)
 where section_key = 'homepage_hero'
   and (content ? 'headline_top') is not true;

-- ============================================================
-- Verify:
--   select section_key, content from public.cms_content
--     where section_key = 'homepage_hero';
-- ============================================================
