import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'demo/src',
  plugins: [react({ jsxRuntime: 'classic' })],
  build: { outDir: '../../build' },
})
