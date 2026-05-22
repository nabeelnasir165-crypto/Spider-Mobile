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
    build: {
      outDir,
      // Push the warning ceiling so we don't get noise on a single shared chunk.
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          // Long-cached vendor splits. Each chunk gets its own hash so a bump
          // to one library doesn't bust the cache for the others. Vite 8 /
          // Rolldown requires the function form.
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('framer-motion'))        return 'motion-vendor';
            if (id.includes('lucide-react'))         return 'icons-vendor';
            if (id.includes('@supabase'))            return 'supabase-vendor';
            if (id.includes('react-router'))         return 'react-vendor';
            if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
          },
        },
      },
    },
  };
});
