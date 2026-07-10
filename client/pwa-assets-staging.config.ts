import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  images: ['public/favicon-staging.svg'],
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [],
    },
    maskable: {
      sizes: [512],
      padding: 0.1,
      resizeOptions: { background: '#0a0a0f' },
    },
    apple: {
      sizes: [180],
      padding: 0.1,
      resizeOptions: { background: '#0a0a0f' },
    },
  },
})
