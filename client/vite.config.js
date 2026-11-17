import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
// Canonical origin for SEO tags: explicit VITE_SITE_URL, else SITE_URL, else Render's public URL.
process.env.VITE_SITE_URL ||= process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || '';
const cert = (f) => path.join(root, 'certs', f);
const https = fs.existsSync(cert('localhost.pem'))
  ? { key: fs.readFileSync(cert('localhost-key.pem')), cert: fs.readFileSync(cert('localhost.pem')) }
  : undefined;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  ...(process.env.LX_REACT_DEV ? { define: { 'process.env.NODE_ENV': '"development"' }, build: { minify: false } } : {}),
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    https,
    allowedHosts: ['lexium.local', 'localhost'],
    proxy: {
      '/api': { target: 'https://127.0.0.1:4000', secure: false, changeOrigin: false },
      '/uploads': { target: 'https://127.0.0.1:4000', secure: false },
      '/sitemap.xml': { target: 'https://127.0.0.1:4000', secure: false },
      '/robots.txt': { target: 'https://127.0.0.1:4000', secure: false },
    },
  },
  build: { outDir: 'dist', sourcemap: false, cssCodeSplit: true, assetsInlineLimit: 0 }, // no data: URIs (strict CSP)
  test: { environment: 'jsdom', setupFiles: ['./src/test-setup.js'], globals: true },
});
