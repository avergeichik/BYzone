import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // '/' serves the custom domain at its apex; '/BYzone/' the GitHub Pages
    // project URL. Locally it comes from .env, in CI from a repository variable
    // passed through the environment, which loadEnv does not read on its own.
    base: process.env.VITE_BASE || env.VITE_BASE || '/',
    plugins: [
      react(),
      ...vitePrerenderPlugin({
        renderTarget: '#root',
      }),
    ],
  }
})
