/// <reference types="vitest/config" />
import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site is served at /<repo-name>/
const base =
  process.env.GITHUB_REPOSITORY != null
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/'

/** Copy index.html to 404.html so GitHub Pages serves the SPA for direct/refresh on any route. */
function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist')
      const index = join(outDir, 'index.html')
      const fallback = join(outDir, '404.html')
      if (existsSync(index)) {
        copyFileSync(index, fallback)
      }
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    open: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
