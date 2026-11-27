import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

import { createAdvisorHandler } from './server/advisor.js'

function advisorApi() {
  const mount = server => {
    const env = loadEnv(server.config.mode, server.config.envDir, 'OPENAI_')
    const handle = createAdvisorHandler({apiKey: env.OPENAI_API_KEY})
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] === '/api/advisor') return handle(req, res)
      next()
    })
  }
  return {name: 'advisor-api', configureServer: mount, configurePreviewServer: mount}
}

export default defineConfig({
  plugins: [react(), advisorApi()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
