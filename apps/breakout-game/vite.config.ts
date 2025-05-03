import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Change the port to 3001
    strictPort: true, // Fail if port is already in use
    host: true, // Listen on all addresses
  },
  preview: {
    port: 3001, // Also use the same port for preview mode
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000 // phaser a un gros boule
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})