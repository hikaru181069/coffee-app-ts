import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // /api で始まるお願いは、サーバー(Hono)に中継する
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
