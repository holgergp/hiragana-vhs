import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use root base for Netlify; keep /hiragana-vhs/ for GitHub Pages
const base = process.env.NETLIFY ? '/' : '/hiragana-vhs/'

export default defineConfig({
  plugins: [react()],
  base,
})
