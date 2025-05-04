import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 3001,
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'phaser': path.resolve(__dirname, '../../node_modules/phaser')
    }
  },
  optimizeDeps: {
    include: ['phaser']
  }
})