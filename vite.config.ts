import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    server: {
      // 🚨 listen on Vercel’s $PORT (default 3000) when set:
      port: Number(process.env.PORT) || 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/api/datagolf': {
          target: env.VITE_DG_API_URL,
          changeOrigin: true,
          rewrite: (path) => {
            // strip /api/datagolf, then append your key
            const clean = path.replace(/^\/api\/datagolf/, '')
            return clean + (clean.includes('?') ? '&' : '?') + `key=${env.VITE_DG_API_KEY}`
          }
        }
      }
    },
  }
})
