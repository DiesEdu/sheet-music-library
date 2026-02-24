import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Explicitly bind to all network interfaces
    port: 3000,
    open: true,
    strictPort: true, // Fail if port is already in use
    cors: true // Enable CORS for network access
  }
})