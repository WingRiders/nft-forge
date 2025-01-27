import {defineConfig} from 'vitest/config'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'

dotenv.config({path: '.env.test'})

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
  },
})
