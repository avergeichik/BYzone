import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // '/' serves the custom domain at its apex. Set VITE_BASE=/BYzone/ in .env
    // to build for the GitHub Pages project URL instead.
    base: env.VITE_BASE || '/',
    plugins: [
      react(),
      ...vitePrerenderPlugin({
        renderTarget: '#root',
      }),
    ],
  }
})
