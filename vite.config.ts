import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import string from "vite-plugin-string"



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), string({ include: "**/*.md" })],
  // assetsInclude: ['**/*.md'],
  // Note: Pre-rendering removed due to plugin compatibility issues
  // Google can still crawl React apps effectively with proper meta tags
})
