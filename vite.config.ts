import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site is served at /<repo-name>/
const base =
  process.env.GITHUB_REPOSITORY != null
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    open: true,
  },
})
