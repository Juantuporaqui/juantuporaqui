import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages sirve la app bajo un subpath. VITE_BASE_PATH lo define el workflow.
const base = process.env.VITE_BASE_PATH || '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    // Tailwind v4 (plugin oficial para Vite)
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'Case Ops - Gestión de Litigio',
        short_name: 'Case Ops',
        description: 'PWA offline-first para gestión de litigio con gran volumen documental',
        theme_color: '#2563eb',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          // Visor PDF (pesado)
          pdfjs: ['pdfjs-dist'],
          // Analytics
          recharts: ['recharts'],
          // Iconos
          lucide: ['lucide-react'],
        },
      },
    },
  },
});
