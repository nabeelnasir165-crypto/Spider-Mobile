import { createClient } from '@supabase/supabase-js';

// Read from either prefix:
//   VITE_SUPABASE_URL / KEY        — local dev (.env.local convention)
//   NEXT_PUBLIC_SUPABASE_URL / KEY — Vercel ↔ Supabase marketplace integration
const env = import.meta.env;
const supabaseUrl =
  env.VITE_SUPABASE_URL ||
  env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  env.VITE_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Spider Mobiles] Supabase is not configured. Login & booking will not work until you:\n' +
    '  1. Create a project at supabase.com\n' +
    '  2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local\n' +
    '     (or install the Vercel ↔ Supabase integration which sets NEXT_PUBLIC_* vars)\n' +
    '  3. Restart the dev server (npm run dev)'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_anon_key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
