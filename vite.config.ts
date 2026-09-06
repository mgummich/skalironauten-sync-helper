import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Build only: the dev server needs inline scripts/styles for HMR and Fast Refresh.
// blob: is for the object URLs of uploaded mood images.
const csp: Plugin = {
  name: 'csp',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: {
        'http-equiv': 'Content-Security-Policy',
        content: "default-src 'self'; img-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'none'"
      },
      injectTo: 'head-prepend'
    }
  ]
};

export default defineConfig({
  // Relative asset paths so the build works under a GitHub Pages project subpath.
  base: './',
  plugins: [react(), tailwindcss(), csp],
  server: { port: 3000 }
});
