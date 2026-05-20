import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Per-target build:
//   vite build --mode site  → ./dist-site  (customer apex domain)
//   vite build --mode admin → ./dist-admin (admin subdomain, robots noindex)
//   vite build              → ./dist       (combined, default for one-host dev)
export default defineConfig(({ mode }) => {
  // We accept env vars under both VITE_ (our local convention) and
  // NEXT_PUBLIC_ (what the Vercel Supabase integration sets). Vite only
  // exposes vars that match a prefix in `envPrefix`, so we list both.
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_BUILD_TARGET || 'all';

  const outDir =
    target === 'site'  ? 'dist-site'  :
    target === 'admin' ? 'dist-admin' :
                         'dist';

  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    plugins: [
      react(),
      {
        name: 'spider-mobiles-html-target',
        transformIndexHtml: {
          order: 'pre',
          handler(html) {
            if (target === 'admin') {
              return html
                .replace(/<title>[^<]*<\/title>/, '<title>Spider Mobiles · Admin</title>')
                .replace(
                  '<meta charset="UTF-8" />',
                  '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex, nofollow, noarchive" />'
                );
            }
            return html;
          },
        },
      },
    ],
    build: { outDir },
  };
});
