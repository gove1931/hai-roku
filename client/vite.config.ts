import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const suffix = env.VITE_OGP_SUFFIX || ''
  const isStaging = suffix !== ''

  return {
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: isStaging ? '[Staging] 牌録' : '牌録',
        short_name: isStaging ? '[Staging] 牌録' : '牌録',
        description: '麻雀収支管理アプリ',
        theme_color: '#863bff',
        background_color: '#0a0a0f',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: `pwa-64x64${suffix}.png`, sizes: '64x64', type: 'image/png' },
          { src: `pwa-192x192${suffix}.png`, sizes: '192x192', type: 'image/png' },
          { src: `pwa-512x512${suffix}.png`, sizes: '512x512', type: 'image/png' },
          { src: `maskable-icon-512x512${suffix}.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3010",
      },
    },
  },
  }
})
