import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Delala | دلالة',
        short_name: 'دلالة',
        description: 'أكبر سوق إلكتروني في السودان',
        theme_color: '#115ea3',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://placehold.co/192x192/115ea3/ffffff?text=Delala',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://placehold.co/512x512/115ea3/ffffff?text=Delala',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
