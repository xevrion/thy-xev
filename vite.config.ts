import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import string from "vite-plugin-string"



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), string({ include: "**/*.md" })],
  // assetsInclude: ['**/*.md'],
})
