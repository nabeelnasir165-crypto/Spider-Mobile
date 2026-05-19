import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function SetupBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
      <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
      <div className="text-sm text-amber-900 leading-relaxed">
        <p className="font-semibold mb-1">Supabase not configured</p>
        <p className="text-amber-800">
          Login & signup won&rsquo;t work until you add your project keys to{' '}
          <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono text-xs">.env.local</code>{' '}
          and restart the dev server. See{' '}
          <a
            href="https://github.com/nabeelnasir165-crypto/Spider-Mobile/blob/main/supabase/README.md"
            target="_blank"
            rel="noreferrer"
            className="underline font-medium inline-flex items-center gap-1"
          >
            setup guide <ExternalLink size={11} />
          </a>
        </p>
      </div>
    </div>
  );
}
